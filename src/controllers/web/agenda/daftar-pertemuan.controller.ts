import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import { QueryTypes } from "sequelize";
import db from "@config/database";
import { ParamsDsnNidnAndTahunRequest } from "@schema/trx-agenda.schema";
import RefDosepem from "@models/ref-dospem.models";

export const getAllPertemuan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsDsnNidnAndTahunRequest["params"]["nidn"] = req.params.nidn as string;
        const tahun: ParamsDsnNidnAndTahunRequest["params"]["nidn"] = req.params.tahun as string;

        const getDataDsn = await RefDosepem.findOne({
            attributes: ["nama_dospem"],
            where: {
                nidn: nidn
            }
        });

        if (!getDataDsn) throw new CustomError(httpCode.notFound, "Data Dospem pembimbing Tesis Tidak Ditemukan");

        const getDataTesisMhs = await db.query(`SELECT id_trx_agenda, nim,
        CAST(tgl_bimbingan AS CHAR) tgl_bimbingan, keterangan_bimbingan,
        kategori_agenda, agenda_pertemuan,
        status_persetujuan_jadwal
        FROM trx_agenda
        WHERE nidn = :nidn
        AND YEAR(tgl_bimbingan) = :tahun
        ORDER BY 
            CASE 
                WHEN status_persetujuan_jadwal = 'belum disetujui' THEN 0 
                ELSE 1 
            END, tgl_bimbingan`, {
            replacements: { nidn: nidn, tahun: tahun },
            type: QueryTypes.SELECT
        });

        if (getDataTesisMhs.length === 0) throw new CustomError(httpCode.notFound, "Anda Tidak Memiliki Agenda Bimbingan");

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getDataTesisMhs)
    } catch (error) {
        errorLogger.error("Error get daftar pertemuan : ", error)
        next(error);
    }
}