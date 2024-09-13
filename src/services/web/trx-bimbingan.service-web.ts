import db from "@config/database";
import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import BimbinganMhs from "@models/bimbingan-mhs.models";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";
import TrxBimbinganMhs, { TrxBimbinganMhsInput, TrxBimbinganMhsOutput } from "@models/trx-bimbingan-mhs.models";
import { cekTgl } from "@utils/cek-tgl";
import { httpCode } from "@utils/prefix";
import { removeFile } from "@utils/remove-file";
import { QueryTypes, Op, fn, col } from "sequelize";

const getDataBimbinganByNim = async (
    nim: string
) => {
    try {
        const getBimbingan = await db.query(`SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            a.id_sub_materi_pembahasan, a.sub_materi_pembahasan, a.status_sub_materi,
            b.id_trx_bimbingan, b.nim, b.url_path_doc, b.tgl_upload, b.tgl_review
            FROM (SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
            FROM ref_materi_pembahasan a
            JOIN ref_sub_materi_pembahasan b
            ON a.id_materi_pembahasan = b.id_materi_pembahasan) a
            LEFT JOIN (SELECT id_trx_bimbingan, nim, id_sub_materi_pembahasan,
            url_path_doc, tgl_upload, tgl_review
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
                    attributes: ['id_bimbingan', 'status_persetujuan', 'tgl_detail_review']
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
                    kemajuan: valPersetujuan,
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
                });
                dataNew.push({
                    id_materi_pembahasan: i.id_materi_pembahasan,
                    materi_pembahasan: i.materi_pembahasan,
                    id_sub_materi_pembahasan: i.id_sub_materi_pembahasan,
                    sub_materi_pembahasan: i.sub_materi_pembahasan,
                    status_sub_materi: i.status_sub_materi,
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    nim: i.nim,
                    url_path_doc: i.url_path_doc,
                    tgl_upload: i.tgl_upload,
                    tgl_terakhir_review: i.tgl_review,
                    kemajuan: kemajuan
                })
            })
        )
        return dataNew;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataHistoryBimbinganByNim = async (
    nim: string,
    id_sub_materi_pembahasan: string
) => {
    try {
        const getBimbingan = await db.query(`SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            a.id_sub_materi_pembahasan, a.sub_materi_pembahasan, a.status_sub_materi,
            b.id_trx_bimbingan, b.nim, b.url_path_doc, b.tgl_upload, b.tgl_review
            FROM (SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
            FROM ref_materi_pembahasan a
            JOIN ref_sub_materi_pembahasan b
            ON a.id_materi_pembahasan = b.id_materi_pembahasan) a
            JOIN (SELECT id_trx_bimbingan, nim, id_sub_materi_pembahasan,
            url_path_doc, tgl_upload, tgl_review
            FROM trx_bimbingan_mhs 
            WHERE nim = :nim
            AND id_sub_materi_pembahasan = :id_sub_materi
            AND NOT id_trx_bimbingan = (SELECT MAX(id_trx_bimbingan) 
            FROM trx_bimbingan_mhs 
            WHERE nim = :nim
            AND id_sub_materi_pembahasan = :id_sub_materi
            GROUP BY id_sub_materi_pembahasan )) b
            ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan`,
            {
                replacements: { nim: nim, id_sub_materi: id_sub_materi_pembahasan },
                type: QueryTypes.SELECT
            }
        );

        if (getBimbingan.length === 0) throw new CustomError(httpCode.notFound, "histori bimbingan tidak ditemukan")

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
                id_sub_materi_pembahasan: id_sub_materi_pembahasan,
                id_trx_bimbingan: {
                    [Op.notIn]: db.literal(`
                      (SELECT MAX(id_trx_bimbingan) FROM trx_bimbingan_mhs 
                      WHERE nim = '${nim}' 
                      AND id_sub_materi_pembahasan = '${id_sub_materi_pembahasan}'
                      GROUP BY id_sub_materi_pembahasan)
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
                    tgl_upload: i.tgl_upload,
                    tgl_terakhir_review: i.tgl_review,
                    kemajuan: kemajuan
                })
            })
        )
        return dataNew;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeTrxBimbinganByNim = async (
    nim: string,
    id_sub_materi_pembahasan: number,
    url_path_doc: string,
    tgl_upload: string
): Promise<TrxBimbinganMhsInput> => {
    // const t = await db.transaction();
    try {
        const cekPayloadTgl = cekTgl(tgl_upload)

        if(cekPayloadTgl === false) throw new CustomError(httpCode.badRequest, "Pastikan format tgl_upload YYYY-MM-DD HH:MM:SS")
        const checkDospem = await RefDosepemMhs.findAll({
            attributes: ["id_dospem_mhs", "nidn", "status_persetujuan"],
            where: {
                nim: nim,
                status_persetujuan: "setuju"
            }
        });

        if (checkDospem.length < 2) throw new CustomError(httpCode.badRequest, "Dosen pembimbing belum ditetapkan atau belum diterima")

        if (checkDospem.length > 2) throw new CustomError(httpCode.badRequest, "Ada kesalahan sistem saat penetapan dospem")

        const payloadTrx: TrxBimbinganMhsInput = {
            nim: nim,
            id_sub_materi_pembahasan: id_sub_materi_pembahasan,
            url_path_doc: url_path_doc,
            tgl_upload: tgl_upload
        }
        const storeTrx = await TrxBimbinganMhs.create(payloadTrx
            // , { transaction: t }
        )

        if (!storeTrx) throw new CustomError(httpCode.badRequest, "Gagal Upload Data[0]")

        const getIdMaxTrx = await TrxBimbinganMhs.findOne({
            attributes: [[fn('MAX', col('id_trx_bimbingan')), "id_trx_bimbingan"]],
            where: {
                nim: nim
            }
        })

        if (!getIdMaxTrx) throw new CustomError(httpCode.badRequest, "Gagal Upload Data[1]")

        const idDospemArrNol = checkDospem[0].id_dospem_mhs
        const idDospemArrSatu = checkDospem[0].id_dospem_mhs
        const payloadRef = [
            {
                id_dospem_mhs: idDospemArrNol,
                id_trx_bimbingan: getIdMaxTrx.get("id_trx_bimbingan"),
            },
            {
                id_dospem_mhs: idDospemArrSatu,
                id_trx_bimbingan: getIdMaxTrx.get("id_trx_bimbingan"),
            }
        ]

        const storeRefBimbingan = await BimbinganMhs.bulkCreate(payloadRef
            // , { transaction: t }
        )

        if (!storeRefBimbingan) throw new CustomError(httpCode.badRequest, "Gagal Upload Data[2]")

        // t.commit()
        return storeTrx
    } catch (error: any) {
        // t.rollback()
        removeFile(url_path_doc)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updateFileTrxBimbinganByNim = async (
    id_trx_bimbingan: number,
    url_path_doc: string
) => {
    try {
        const getFileNameEks = await TrxBimbinganMhs.findOne({
            attributes: ["url_path_doc"],
            where: {
                id_trx_bimbingan: id_trx_bimbingan
            }
        })

        if (!getFileNameEks) throw new CustomError(httpCode.notFound, "Data bimbingan tidak ditemukan")

        const fileNameEks = getFileNameEks.url_path_doc;

        const updateFileNew = await TrxBimbinganMhs.update({
            url_path_doc: url_path_doc
        }, {
            where: { id_trx_bimbingan: id_trx_bimbingan }
        })

        if (!updateFileNew) throw new CustomError(httpCode.badRequest, "Gagal update file")

        await removeFile(fileNameEks)

        return updateFileNew;
    } catch (error: any) {
        removeFile(url_path_doc)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getDataBimbinganByNim,
    storeTrxBimbinganByNim,
    updateFileTrxBimbinganByNim,
    getDataHistoryBimbinganByNim
}