import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import serviceProfile from "@services/web/profiles.service-web";
import { ParamsKetDospemRequest, ParamsNidnRequest, ParamsNimRequest } from "@schema/ref-dospem-mhs.schema";
import { keterangan_dospem } from "@models/ref-dospem-mhs.models";

export const profileMhsByNidnAndKetDospem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const keteranganDospem: ParamsKetDospemRequest["params"]["keterangan_dospem"] = req.params.keterangan_dospem as keterangan_dospem;
        const dataProfile = await serviceProfile.profileMhsByNidnKetDospem(nidn, keteranganDospem)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", dataProfile)
    } catch (error) {
        errorLogger.error("Error profile mhs : ", error)
        next(error);
    }
}

export const profileMhsByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimRequest["params"]["nim"] = req.params.nim as string;
        const dataProfile = await serviceProfile.profileMhsByNim(nim)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", dataProfile)
    } catch (error) {
        errorLogger.error("Error profile mhs : ", error)
        next(error);
    }
};

export const profileDsnByNidn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const dataProfile = await serviceProfile.profileDsnByNidn(nidn)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", dataProfile)
    } catch (error) {
        errorLogger.error("Error profile mhs : ", error)
        next(error);
    }
};