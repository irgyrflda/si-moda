import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/trx-masukan.service-web";
import { ParamsIdTrxBimbinganRequest } from "@schema/trx-bimbingan.schema";
import { TrxMasukanDsnInput } from "@models/trx-masukan-dospem.models";

export const getAllMasukanByIdTrxbimbingan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idTrxBimbingan : ParamsIdTrxBimbinganRequest["params"]["id_trx_bimbingan"] = req.params.id_trx_bimbingan as string;
        const getMasukan = await service.getMasukanByIdTrxBimbingan(idTrxBimbingan)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getMasukan)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const storeTrxMasukan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const storeMasukan = await service.storeMasukanTrxBimbingan(req.body.id_trx_bimbingan, req.body.id_dospem_mhs, req.body.masukan)

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", storeMasukan)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}