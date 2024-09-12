import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/ref-dospem.service-web";
import { ParamsNidnRequest } from "@schema/ref-dospem.schema";

export const getAllDataDospem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const getData = await service.getAllDataDospem()

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const getByNidnDataDospem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const getData = await service.getByNidnDataDospem(nidn)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}