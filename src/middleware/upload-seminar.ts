import multer, { FileFilterCallback, Multer } from "multer";
import fs from "fs/promises";
import CustomError from "./error-handler";
import { Request } from "express";
import { httpCode } from "@utils/prefix";
import { debugLogger } from "@config/logger";
import getConfig from "@config/dotenv";

const allowedMimeTypesPdf = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];

const storageAsli = multer.diskStorage({
    destination: async (req, file, callback) => {
        console.log("file : ", file);
        
        const pathAplikasi = getConfig("STORAGE_UPLOAD_PDF")

        const folderPath = pathAplikasi;
        try {
            await fs.access(folderPath);
        } catch (error) {
            await fs.mkdir(folderPath, { recursive: true });
        }
        callback(null, folderPath);
    },
    filename: async (req, file, callback) => {
        const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + '=' + file.originalname;

        if (allowedMimeTypesPdf.includes(file.mimetype)) {
            const fileName = `${name}.${file.originalname}`;
            callback(null, fileName);
        }
    },
});

const fileFilterPdf = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (allowedMimeTypesPdf.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
        cb(
            new CustomError(
                httpCode.unsupportedMediaType,
                `Format file harus berupa ${allowedMimeTypesPdf.join(" | ")}`
            )
        );
    }
};

const uploadFileSeminar: Multer = multer({
    storage: storageAsli,
    fileFilter: fileFilterPdf,
    limits: { fileSize: 10 * 1024 * 1024 }
})

export { uploadFileSeminar };