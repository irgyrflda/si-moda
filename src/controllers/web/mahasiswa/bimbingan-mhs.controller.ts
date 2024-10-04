import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import logger, { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import { ParamsNimAndIdSubMateriTrxBimbinganRequest, ParamsNimAndKeteranganSeminarRequest, ParamsNimTrxBimbinganRequest } from "@schema/trx-bimbingan.schema";
import serviceBimbingan from "@services/web/trx-bimbingan.service-web";
import { removeFile } from "@utils/remove-file";
import cekTypeFile from "@utils/cek-typefile";
import RefTesisMhs from "@models/ref-tesis-mhs.models";

export const getSeminarByNimAndKeteranganSeminar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimAndKeteranganSeminarRequest["params"]["nim"] = req.params.nim as string;
        const keteranganSeminar: ParamsNimAndKeteranganSeminarRequest["params"]["keterangan_seminar"] = req.params.keterangan_seminar as string;

        const dataNew = await serviceBimbingan.getDataSeminarByNimAndKeteranganSeminar(nim, keteranganSeminar);

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", dataNew)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const getAllBimbinganByNim = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimTrxBimbinganRequest["params"]["nim"] = req.params.nim as string;

        const dataNew = await serviceBimbingan.getDataBimbinganByNim(nim);

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", dataNew)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const getHistoryBimbinganByNimAndIdSubMateri = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimAndIdSubMateriTrxBimbinganRequest["params"]["nim"] = req.params.nim as string;
        const idSubMateri: ParamsNimAndIdSubMateriTrxBimbinganRequest["params"]["id_sub_materi_pembahasan"] = req.params.id_sub_materi_pembahasan as string;

        const dataNew = await serviceBimbingan.getDataHistoryBimbinganByNim(nim, idSubMateri);

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", dataNew)
    } catch (error) {
        errorLogger.error("Error bimbingan : ", error)
        next(error);
    }
}

export const uploadPdf = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) throw new CustomError(httpCode.badRequest, "tidak ada file yang di upload")

        if (!req.body.nim || !req.body.id_sub_materi_pembahasan || !req.body.tgl_upload) throw new CustomError(httpCode.badRequest, "nim atau id_sub_materi_pembahasan harus di isi")

        const pathFiles: any = req.file

        const storeBimbingan = await serviceBimbingan.storeTrxBimbinganByNim(req.body.nim, parseInt(req.body.id_sub_materi_pembahasan), pathFiles.filename, req.body.tgl_upload)

        responseSuccess(res, httpCode.ok, "Berhasil upload", storeBimbingan)
    } catch (error) {
        errorLogger.error(`error upload ${error}`)
        next(error);
    }
}

export const uploadUlangPdf = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) throw new CustomError(httpCode.badRequest, "tidak ada file yang di upload")

        if (!req.body.id_trx_bimbingan) throw new CustomError(httpCode.badRequest, "id_trx_bimbingan harus di isi")

        const pathFiles: any = req.file

        const storeBimbingan = await serviceBimbingan.updateFileTrxBimbinganByNim(parseInt(req.body.id_trx_bimbingan), pathFiles.filename)

        responseSuccess(res, httpCode.ok, "Berhasil update file", storeBimbingan)
    } catch (error) {
        errorLogger.error(`error upload ${error}`)
        next(error);
    }
}

export const uploadPdfSeminar = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.files || req.files?.length === 0) throw new CustomError(httpCode.badRequest, "tidak ada file yang di upload")

        const pathFiles: any = req.files

        if (pathFiles.length < 2) {
            await removeFile(pathFiles[0].filename)
            throw new CustomError(httpCode.badRequest, "Jumlah file harus lebih dari satu")
        }

        if (!req.body.nim || !req.body.tgl_upload) {
            pathFiles.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "nim dan tgl_upload harus di isi")
        }

        if (!req.body.keterangan_seminar) {
            pathFiles.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "keterangan_seminar harus di isi")
        }

        if (req.body.keterangan_seminar !== "proposal" && req.body.keterangan_seminar !== "hasil") {
            pathFiles.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "keterangan_seminar harus di isi proposal atau hasil")
        }

        const checkTypeFiles = cekTypeFile(pathFiles)

        if (checkTypeFiles.status === false) {
            pathFiles.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, checkTypeFiles.message)
        }

        const cekStatusMhs = await RefTesisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: req.body.nim
            }
        })

        if (!cekStatusMhs) {
            pathFiles.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Mahasiswa Tidak Terdaftar")
        }

        const kodeStatusMhs = cekStatusMhs.kode_status

        if (kodeStatusMhs !== "T05" && kodeStatusMhs !== "T08") {
            pathFiles.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Anda Belum Diperbolehkan Upload")
        }
        
        const storeSeminar = await serviceBimbingan.storeSeminarMhs(req.body.nim, req.body.keterangan_seminar, pathFiles[0].filename, pathFiles[1].filename, req.body.tgl_upload, pathFiles, kodeStatusMhs)

        responseSuccess(res, httpCode.ok, "Berhasil upload", storeSeminar)
    } catch (error) {
        errorLogger.error(`error upload ${error}`)
        next(error);
    }
}