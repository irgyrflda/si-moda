import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/ref-dospem-mhs.service-web";
import { ParamsIdRequest, ParamsNimRequest, PayloadRequest } from "@schema/ref-dospem-mhs.schema";
import { RefDospemMhsInput } from "@models/ref-dospem-mhs.models";

export const getByIdDataDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: ParamsIdRequest["params"]["id_dospem_mhs"] = req.params.id_dospem_mhs as string;
        const getData = await service.getByIdDataDospemMhs(id)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const getByNimDataDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimRequest["params"]["nim"] = req.params.nim as string;
        const getData = await service.getByNimDataDospemMhs(nim)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const storeDataDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const payload: RefDospemMhsInput = {
            nidn: req.body.nidn,
            nim: req.body.nim,
            keterangan_dospem: req.body.keterangan_dospem
        }

        const store : RefDospemMhsInput = await service.storeDataDospemMhs(payload)

        responseSuccess(res, httpCode.ok, "Berhasil membuat data", store)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}