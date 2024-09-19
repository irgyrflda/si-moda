import dataDummyMsh from "@public/data-dummy-mhs.json";
import dataDummyDsn from "@public/data-dummy-dsn.json";
import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";

const getDataMhs = async () => {
    try {
        const dataMhs = dataDummyMsh

        return dataMhs;
    } catch (error: any) {
        console.log("error get data profile : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataMhsByNim = async (
    nomorInduk: string
) => {
    try {
        const nim = nomorInduk;
        const dataMhs = dataDummyMsh.find((i: any) => i.nomor_induk_mahasiswa === nim)

        if (!dataMhs) throw new CustomError(httpCode.notFound, "Data mahasiswa tidak ditemukan")

        return dataMhs;
    } catch (error: any) {
        console.log("error get data profile : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataDsn = async () => {
    try {
        const dataDsn = dataDummyDsn

        return dataDsn;
    } catch (error: any) {
        console.log("error get data profile : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataDsnByNidn = async (
    nomorInduk: string
) => {
    try {
        const nidn = nomorInduk;
        const dataDsn = dataDummyDsn.find((i: any) => i.nomor_induk_dosen_nasional === nidn)

        if (!dataDsn) throw new CustomError(httpCode.notFound, "Data dosen tidak ditemukan")

        return dataDsn;
    } catch (error: any) {
        console.log("error get data profile : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataMhsByNimReturnBool = async (
    nomorInduk: string
) => {
    try {
        const nim = nomorInduk;
        const dataMhs = dataDummyMsh.find((i: any) => i.nomor_induk_mahasiswa === nim)

        let dataMhsBool: boolean = true

        if (!dataMhs) dataMhsBool = false

        return {
            dataMhsBool,
            dataMhs
        };
    } catch (error: any) {
        console.log("error get data profile : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataDsnByNidnReturnBool = async (
    nomorInduk: string
) => {
    try {
        const nidn = nomorInduk;
        const dataDsn = dataDummyDsn.find((i: any) => i.nomor_induk_dosen_nasional === nidn)

        let dataDsnBool: boolean = true
        if (!dataDsn) dataDsnBool = false

        return {
            dataDsnBool,
            dataDsn
        };
    } catch (error: any) {
        console.log("error get data profile : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getDataMhs,
    getDataMhsByNim,
    getDataDsn,
    getDataDsnByNidn,
    getDataMhsByNimReturnBool,
    getDataDsnByNidnReturnBool
}