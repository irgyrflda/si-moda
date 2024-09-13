import path from "path";
import fs from "fs/promises";
import { errorLogger } from "@config/logger";
import getConfig from "@config/dotenv";

const checkFileExists = async (file: string): Promise<boolean> => {
  try {
    await fs.access(file);
    return true; // File eksis
  } catch {
    return false; // File tidak ditemukan
  }
}

const removeFile = async (filePath: any) => {
  const file: string = path.join(getConfig("STORAGE_UPLOAD_PDF"), filePath);

  try {
    const cek = await checkFileExists(file)
    if (cek === true) {
      await fs.unlink(file)
    }
  } catch (error) {
    errorLogger.error(`ERROR REMOVE FILE: ${error}`);
  }
};

const removeFileName = async (existFile: URL) => {
  try {
    const filePath = existFile.pathname;
    const file = path.join(__dirname, `../../${filePath}`);
    await fs.unlink(file);
  } catch (error) {
    errorLogger.error(`ERROR REMOVE FILE NAME: ${error}`);
  }
};

export { removeFile, removeFileName };
