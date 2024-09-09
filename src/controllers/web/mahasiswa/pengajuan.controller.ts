import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import serviveTesis from "@services/web/ref-tesis-mhs.service-web";
import RefTersisMhs from "@models/ref-tesis-mhs.models";

export const getTesisByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim = req.params.nim;

        const getData = await serviveTesis.getByNimTesisMhsLengkap(nim)

        if (!getData) throw new CustomError(httpCode.badRequest, "Gagal Memuat Data")

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error get data tesis : ", error)
        next(error);
    }
}

export const pengajuanJudulAndDospem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const nim = req.body.nim;
    const judulTesis = req.body.judul_tesis;
    const dospem = req.body.dospem;
    const topikTesis = req.body.topik_tesis;

    try {
        const cekDataTesisMhs = await RefTersisMhs.findOne({
            attributes: ["nim", "judul_tesis", "kode_status"],
            where: {
                nim: nim
            }
        })
        if (cekDataTesisMhs) throw new CustomError(httpCode.conflict, "Data tesis pada mahasiswa tersebut sudah ada")

        const storeTesis = await serviveTesis.storeTesisMhs(nim, judulTesis, dospem, topikTesis)

        if (!storeTesis) throw new CustomError(httpCode.badRequest, "Gagal Membuat Data")

        responseSuccess(res, httpCode.ok, "Berhasil Membuat data");
    } catch (error) {
        debugLogger.error("error pengajuan : ", error)
        next(error);
    }

}

export const updateJudulTesis = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cekDataTesis = await serviveTesis.getByNimTesisMhs(req.params.nim)

        if (!cekDataTesis) throw new CustomError(httpCode.notFound, "Data Tidak Ditemukan")

        const update = await serviveTesis.updateJudulTesis(req.params.nim, req.body.judul_tesis)

        if (!update) throw new CustomError(httpCode.badRequest, "Gagal Mengubah Data")

        responseSuccess(res, httpCode.ok, "Berhasil mengubah judul tesis")

    } catch (error) {
        errorLogger.error("Error update judul tesis : ", error)
        next(error);
    }
}