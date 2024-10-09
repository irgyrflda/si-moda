import { errorLogger } from "@config/logger";
import { ParamsNimAndKeteranganSeminarRequest } from "@schema/trx-bimbingan.schema";
import { NextFunction, Request, response, Response } from "express";
import serviceGenerateDokumenKelayakan from "@services/web/dokumen-kelayakan.service-web";
import CustomError from "@middleware/error-handler";
import { httpCode, responseStatus } from "@utils/prefix";
import { responseSuccess } from "@utils/response-success";

export const generateDokumenKelayakan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimAndKeteranganSeminarRequest["params"]["nim"] = req.params.nim as string;
        const keteranganSeminar: ParamsNimAndKeteranganSeminarRequest["params"]["keterangan_seminar"] = req.params.keterangan_seminar as string;

        const data = await serviceGenerateDokumenKelayakan.generateDokumenKelayakan(nim, keteranganSeminar)

        responseSuccess(res, httpCode.ok, "Berhasil memuat Data", data)
    } catch (error) {
        errorLogger.error(`error upload ${error}`)
        next(error);
    }
}