import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import { ParamsNimTrxBimbinganRequest } from "@schema/trx-bimbingan.schema";
import { QueryTypes, Op, fn, col } from "sequelize";
import db from "@config/database";
import BimbinganMhs from "@models/bimbingan-mhs.models";
import TrxBimbinganMhs from "@models/trx-bimbingan-mhs.models";
import serviceBimbingan from "@services/web/trx-bimbingan.service-web";

export const getAllBimbinganByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimTrxBimbinganRequest["params"]["nim"] = req.params.nim as string;

        const getBimbingan = await db.query(`SELECT a.id_materi_pembahasan, a.materi_pembahasan,
        a.id_sub_materi_pembahasan, a.sub_materi_pembahasan, a.status_sub_materi,
        b.id_trx_bimbingan, b.nim, b.url_path_doc
        FROM (SELECT a.id_materi_pembahasan, a.materi_pembahasan,
        b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
        FROM ref_materi_pembahasan a
        JOIN ref_sub_materi_pembahasan b
        ON a.id_materi_pembahasan = b.id_materi_pembahasan) a
        LEFT JOIN (SELECT id_trx_bimbingan, nim, id_sub_materi_pembahasan,
        url_path_doc
        FROM trx_bimbingan_mhs 
        WHERE nim = :nim
        AND id_trx_bimbingan IN (SELECT MAX(id_trx_bimbingan) 
        FROM trx_bimbingan_mhs 
        WHERE nim = :nim
        GROUP BY id_sub_materi_pembahasan )) b
        ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan`,
            {
                replacements: { nim: nim },
                type: QueryTypes.SELECT
            }
        );

        if (getBimbingan.length === 0) throw new CustomError(httpCode.notFound, "materi bimbingan tidak ditemukan")

        const getPersetujuanDosepemByNim = await TrxBimbinganMhs.findAll({
            attributes: ['id_trx_bimbingan'],
            include: [
                {
                    model: BimbinganMhs,
                    as: "dospem_tasis_mhs",
                    attributes: ['id_bimbingan', 'status_persetujuan']
                }
            ],
            where: {
                nim: nim,
                id_trx_bimbingan: {
                    [Op.in]: db.literal(`
                  (SELECT MAX(id_trx_bimbingan) FROM trx_bimbingan_mhs 
                  WHERE nim = '${nim}' GROUP BY id_sub_materi_pembahasan)
                `)
                }
            }
        });

        let dataArr: any[] = []

        Promise.all(
            getPersetujuanDosepemByNim.map((i: any) => {
                const belumSesuai = 'Belum Sesuai'
                const belumDiReview = 'Belum direview'
                const sudahSesuai = 'Sudah Sesuai'

                const tidakSetuju = i.dospem_tasis_mhs.some((o: any) => o.status_persetujuan === "tidak setuju")
                const belumReview = i.dospem_tasis_mhs.some((o: any) => o.status_persetujuan === "belum disetujui")

                const valPersetujuan = (tidakSetuju === true) ? belumSesuai : ((belumReview === true) ? belumDiReview : sudahSesuai);

                dataArr.push({
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    kemajuan: valPersetujuan
                })
            })
        )

        let dataNew: any[] = []

        Promise.all(
            getBimbingan.map((i: any) => {
                let kemajuan = null
                dataArr.find((o: any) => {
                    if (o.id_trx_bimbingan === i.id_trx_bimbingan) {
                        kemajuan = o.kemajuan
                    }
                })
                dataNew.push({
                    id_materi_pembahasan: i.id_materi_pembahasan,
                    materi_pembahasan: i.materi_pembahasan,
                    id_sub_materi_pembahasan: i.id_sub_materi_pembahasan,
                    sub_materi_pembahasan: i.sub_materi_pembahasan,
                    status_sub_materi: i.status_sub_materi,
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    nim: i.nim,
                    url_path_doc: i.url_path_doc,
                    kemajuan: kemajuan
                })
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", dataNew)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const uploadPdf = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            throw new CustomError(httpCode.badRequest, "tidak ada file yang di upload")
        }
        if(!req.body.nim || !req.body.id_sub_materi_pembahasan) throw new CustomError(httpCode.badRequest, "nim atau id_sub_materi_pembahasan harus di isi")
        const pathFiles: any = req.file

        const storeBimbingan = await serviceBimbingan.storeTrxBimbinganByNim(req.body.nim, parseInt(req.body.id_sub_materi_pembahasan), pathFiles.filename)

        responseSuccess(res, httpCode.ok, "Berhasil upload pdf", storeBimbingan)
    } catch (error) {
        errorLogger.error(`error upload pdf ${error}`)
        next(error);
    }
}