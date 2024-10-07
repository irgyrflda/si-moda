import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import service from "@services/web/trx-masukan.service-web";
import { ParamsIdTrxBimbinganRequest, ParamsIdTrxSeminarAndIdDospemMhsRequest } from "@schema/trx-bimbingan.schema";
import TrxMasukanDsn, { TrxMasukanDsnInput } from "@models/trx-masukan-dospem.models";
import { ParamsNidnRequest } from "@schema/ref-dospem-mhs.schema";
import { ParamsIdTrxMasukanRequest } from "@schema/trx-masukan.schema";

export const getAllMasukanByIdTrxbimbingan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idTrxBimbingan: ParamsIdTrxBimbinganRequest["params"]["id_trx_bimbingan"] = req.params.id_trx_bimbingan as string;
        const getMasukan = await service.getMasukanByIdTrxBimbingan(idTrxBimbingan)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getMasukan)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const getAllMasukanByIdTrxbimbinganAndNidn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idTrxBimbingan: ParamsIdTrxBimbinganRequest["params"]["id_trx_bimbingan"] = req.params.id_trx_bimbingan as string;
        const nidn: ParamsNidnRequest["params"]["nidn"] = req.params.nidn as string;
        const getMasukan = await service.getMasukanByIdTrxBimbinganAndNidn(idTrxBimbingan, nidn)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getMasukan)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const updateMasukanByIdTrxMasukan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.body.masukan) throw new CustomError(httpCode.badRequest, "masukan tidak boleh kosong")

        const idTrxMasukan: ParamsIdTrxMasukanRequest["params"]["id_trx_masukan"] = req.params.id_trx_masukan as string;
        const checkData = await TrxMasukanDsn.findOne({
            attributes: ["id_dospem_mhs"],
            where: {
                id_trx_masukan: idTrxMasukan
            }
        })

        if (!checkData) throw new CustomError(httpCode.notFound, "Data Masukan Tidak Ditemukan")
        const update = await TrxMasukanDsn.update({
            masukan: req.body.masukan
        }, {
            where: {
                id_trx_masukan: idTrxMasukan
            }
        })

        if (!update) throw new CustomError(httpCode.badRequest, "Gagal Mengubah data")

        responseSuccess(res, httpCode.ok, "Berhasil Mengubah Data", update)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const getAllMasukanIdTrxSeminarAndIdDospemMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idTrxSeminar: ParamsIdTrxSeminarAndIdDospemMhsRequest["params"]["id_trx_seminar"] = req.params.id_trx_seminar as string;
        const idDospemMhs: ParamsIdTrxSeminarAndIdDospemMhsRequest["params"]["id_dospem_mhs"] = req.params.id_dospem_mhs as string;
        const getMasukan = await service.getMasukanByIdTrxSeminarAndIdDospemMhs(idTrxSeminar, idDospemMhs)

        responseSuccess(res, httpCode.ok, "Berhasil Memuat Data", getMasukan)
    } catch (error) {
        errorLogger.error("Error masukan seminar : ", error)
        next(error);
    }
}

export const storeTrxMasukan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const storeMasukan = await service.storeMasukanTrxBimbingan(req.body.id_trx_bimbingan, req.body.id_dospem_mhs, req.body.masukan, req.body.tgl_review)

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", storeMasukan)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const storeTrxMasukanSeminar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const storeMasukan = await service.storeMasukanTrxSeminar(req.body.id_trx_seminar, req.body.id_dospem_mhs, req.body.masukan, req.body.tgl_detail_review)

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", storeMasukan)
    } catch (error) {
        errorLogger.error("Error seminar : ", error)
        next(error);
    }
}