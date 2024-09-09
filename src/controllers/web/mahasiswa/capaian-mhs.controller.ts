import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import RefTersisMhs from "@models/ref-tesis-mhs.models";
import { ParamsTesisMhsNimRequest } from "@schema/ref-tesis-mhs.schema";
import Status from "@models/ref-status.models";
import db from "@config/database";

export const getCapaianMahasiswaByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsTesisMhsNimRequest["params"]["nim"] = req.params.nim as string

        const getDataTesisMhs = await RefTersisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: nim
            }
        });

        if (!getDataTesisMhs) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tesis Tidak Ditemukan");
        const statusTesisMhs = getDataTesisMhs.kode_status
        const getStatus = await Status.findAll({
            attributes: [
                "kode_status", "keterangan_status",
                [db.literal('ROW_NUMBER() OVER (ORDER BY kode_status)'), 'no_urut']
            ],
            where: {
                kategori_status: "capaian_tesis_mhs"
            }
        });

        if (!getStatus) throw new CustomError(httpCode.notFound, "Capaian Tesis Mahasiswa Tidak Ditemukan[0]");

        const capaianTesisMhs: any = getStatus.find((i: any) => i.get("kode_status") === statusTesisMhs)

        if (!capaianTesisMhs) throw new CustomError(httpCode.notFound, "Capaian Tesis Mahasiswa Tidak Ditemukan[1]");

        const totalCapaian = (capaianTesisMhs.get("no_urut") / getStatus.length) * 100;
        
        const dataCapaian = {
            kode_status: capaianTesisMhs.kode_status,
            keterangan_status: capaianTesisMhs.keterangan_status,
            no_urut: capaianTesisMhs.get("no_urut"),
            total_capaian: getStatus.length,
            target_capaian: (totalCapaian).toFixed() + "%",
            dari: "100%",
            capaian: getStatus
        }

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", dataCapaian)
    } catch (error) {
        errorLogger.error("Error get data capaian mhs : ", error)
        next(error);
    }
}