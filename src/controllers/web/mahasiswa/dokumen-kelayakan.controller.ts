import { errorLogger } from "@config/logger";
import { ParamsNimAndKeteranganSeminarRequest } from "@schema/trx-bimbingan.schema";
import { NextFunction, Request, Response } from "express";
import serviceGenerateDokumenKelayakan from "@services/web/dokumen-kelayakan.service-web";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";

export const generateDokumenKelayakan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimAndKeteranganSeminarRequest["params"]["nim"] = req.params.nim as string;
        const keteranganSeminar: ParamsNimAndKeteranganSeminarRequest["params"]["keterangan_seminar"] = req.params.keterangan_seminar as string;

        const dokumenBuffer = await serviceGenerateDokumenKelayakan.generateDokumenKelayakan(nim, keteranganSeminar)

        dokumenBuffer.toBuffer((error, docBuffer) => {
            if (error) throw new CustomError(httpCode.badRequest, "gagal membuat pdf")

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"',
                'Content-Length': docBuffer.length,
            });

            res.send(docBuffer);
        });
    } catch (error) {
        errorLogger.error(`error upload ${error}`)
        next(error);
    }
}