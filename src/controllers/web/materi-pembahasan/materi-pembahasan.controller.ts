import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/ref-materi-pembahasan.service-web";
import { ParamsIdRefMateriRequest, PayloadRefMateriRequest } from "@schema/ref-materi-pembahasan.schema";

export const getAllMateriByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const getMateri = await service.getAllmateriPembahasan()

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getMateri)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const getByIdMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idMateriPembahasan: ParamsIdRefMateriRequest["params"]["id_materi_pembahasan"] = req.params.id_materi_pembahasan as string;
        const getMateri = await service.getByIdmateriPembahasan(idMateriPembahasan)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getMateri)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const storeMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const store = await service.storeMateriPembahasan(req.body.materi_pembahasan)

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", store)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const updateMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idMateriPembahasan: ParamsIdRefMateriRequest["params"]["id_materi_pembahasan"] = req.params.id_materi_pembahasan as string;
        const update = await service.updateMateriPembahasan(idMateriPembahasan, req.body.materi_pembahasan)

        responseSuccess(res, httpCode.ok, "Berhasil Mengubah Data", update)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const deleteMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idMateriPembahasan: ParamsIdRefMateriRequest["params"]["id_materi_pembahasan"] = req.params.id_materi_pembahasan as string;
        const deleteMateri = await service.deleteMateriPembahasan(idMateriPembahasan)

        responseSuccess(res, httpCode.ok, "Berhasil Manghapus Data", deleteMateri)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}