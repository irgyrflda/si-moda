import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/ref-dospem-mhs.service-web";
import { ParamsIdRequest, ParamsKetDospemRequest, ParamsNidnRequest, ParamsNimRequest, PayloadRequest } from "@schema/ref-dospem-mhs.schema";
import { keterangan_dospem, RefDospemMhsInput } from "@models/ref-dospem-mhs.models";
import serviceBimbingan from "@services/web/trx-bimbingan.service-web";

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

export const getByNindDataDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const keteranganDospem: ParamsKetDospemRequest["params"]["keterangan_dospem"] = req.params.keterangan_dospem as keterangan_dospem;
        const getData = await service.getByNidnDataDospemMhs(nidn, keteranganDospem)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const getByNindDataDospemMhsAcc = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const keteranganDospem: ParamsKetDospemRequest["params"]["keterangan_dospem"] = req.params.keterangan_dospem as keterangan_dospem;
        const getData = await service.getByNidnDataDospemMhsAcc(nidn, keteranganDospem)

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", getData)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const updatePersetujuanDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idDospemMhs: ParamsIdRequest["params"]["id_dospem_mhs"] = req.params.id_dospem_mhs as string;
        const statusPersetujuan = req.body.status_persetujuan
        const updatePersetujuan = await service.updatePersetujuanDospem(idDospemMhs, statusPersetujuan)

        responseSuccess(res, httpCode.ok, "Berhasil menyetujui", updatePersetujuan)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const updatePersetujuanBimbinganMhsDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const idTrxBimbingan = req.body.id_trx_bimbingan
        const statusPersetujuan = req.body.status_persetujuan

        await serviceBimbingan.updatePersetujuanBimbinganByNidn(nidn, idTrxBimbingan, statusPersetujuan, )

        responseSuccess(res, httpCode.ok, "Berhasil Mengirim Persetujuan")
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}

export const updatePersetujuanArrayDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatePersetujuan = await service.updatePersetujuanDospemArray(req.body.persetujuan)

        responseSuccess(res, httpCode.ok, "Berhasil menyetujui", updatePersetujuan)
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

        const store: RefDospemMhsInput = await service.storeDataDospemMhs(payload)

        responseSuccess(res, httpCode.ok, "Berhasil membuat data", store)
    } catch (error) {
        errorLogger.error("Error dospem controller : ", error)
        next(error);
    }
}