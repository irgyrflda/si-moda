import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import { ParamsIdNotifRequest, ParamsNomorIndukNotifRequest } from "@schema/trx-notifikasi.schema";
import serviceNotif from "@services/web/trx-notifikasi.service-web";

export const getAllNotifByNomorInduk = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nomorInduk: ParamsNomorIndukNotifRequest["params"]["nomor_induk"] = req.params.nomor_induk as string;

        const getNotif = await serviceNotif.getNotifByNomorInduk(nomorInduk)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getNotif)
    } catch (error) {
        errorLogger.error("Error get notif : ", error)
        next(error);
    }
}

export const getCountNotifByNomorInduk = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nomorInduk: ParamsNomorIndukNotifRequest["params"]["nomor_induk"] = req.params.nomor_induk as string;

        const getNotif = await serviceNotif.getCountNotifByNomorInduk(nomorInduk)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getNotif[0])
    } catch (error) {
        errorLogger.error("Error get notif : ", error)
        next(error);
    }
}

export const updateStatusNotifById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idNotif: ParamsIdNotifRequest["params"]["id_notif"] = parseInt(req.params.id_notif);

        const updateStatusNotif = await serviceNotif.updateNotif(idNotif)

        responseSuccess(res, httpCode.ok, "Berhasil mengubah data", updateStatusNotif)
    } catch (error) {
        errorLogger.error("Error get notif : ", error)
        next(error);
    }
}