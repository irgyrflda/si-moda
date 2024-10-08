import { errorLogger } from "@config/logger";
import { ParamsNimAndKeteranganSeminarRequest } from "@schema/trx-bimbingan.schema";
import { NextFunction, Request, Response } from "express";
import serviceGenerateDokumenKelayakan from "@services/web/dokumen-kelayakan.service-web";

export const generateDokumenKelayakan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsNimAndKeteranganSeminarRequest["params"]["nim"] = req.params.nim as string;
        const keteranganSeminar: ParamsNimAndKeteranganSeminarRequest["params"]["keterangan_seminar"] = req.params.keterangan_seminar as string;

        const dokumenBuffer = await serviceGenerateDokumenKelayakan.generateDokumenKelayakan(nim, keteranganSeminar)

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': dokumenBuffer.length,
            'Content-Disposition': 'inline; filename="Si-PPan-DRAUK.pdf"',
        });
        res.send(dokumenBuffer);

    } catch (error) {
        errorLogger.error(`error upload ${error}`)
        next(error);
    }
}