import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/ref-submateri-pembahasan.service-web";
import { ParamsIdRefSubMateriRequest } from "@schema/ref-submateri-pembahasan.schema";

export const getAllSubMateriByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const getSubMateri = await service.getAllSubMateriPembahasan()

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getSubMateri)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const getByIdSubMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idSubMateriPembahasan: ParamsIdRefSubMateriRequest["params"]["id_sub_materi_pembahasan"] = req.params.id_sub_materi_pembahasan as string;
        const getSubMateri = await service.getByIdSubmateriPembahasan(idSubMateriPembahasan)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getSubMateri)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const storeSubMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const store = await service.storeSubMateriPembahasan(req.body.id_materi_pembahasan, req.body.sub_materi_pembahasan, req.body.status_sub_materi)

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", store)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const updateSubMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idSubMateriPembahasan: ParamsIdRefSubMateriRequest["params"]["id_sub_materi_pembahasan"] = req.params.id_sub_materi_pembahasan as string;
        const update = await service.updateSubMateriPembahasan(idSubMateriPembahasan, req.body.id_materi_pembahasan, req.body.sub_materi_pembahasan, req.body.status_sub_materi)

        responseSuccess(res, httpCode.ok, "Berhasil Mengubah Data", update)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const deleteSubMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idSubMateriPembahasan: ParamsIdRefSubMateriRequest["params"]["id_sub_materi_pembahasan"] = req.params.id_sub_materi_pembahasan as string;
        const deleteSubMateri = await service.deleteSubMateriPembahasan(idSubMateriPembahasan)

        responseSuccess(res, httpCode.ok, "Berhasil Manghapus Data", deleteSubMateri)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}