import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import RefDosepem, { RefDospemInput, RefDospemOutput } from "@models/ref-dospem.models";

const getAllDataDospem = async (

): Promise<RefDospemOutput[]> => {
    try {
        const getData = await RefDosepem.findAll()

        if (getData.length === 0) throw new CustomError(httpCode.notFound, "Data Dospem tidak ditemukan")

        return getData;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByNidnDataDospem = async (
    nidn: string
): Promise<RefDospemOutput> => {
    try {
        const getData: RefDosepem | null = await RefDosepem.findOne({
            where: {
                nidn: nidn
            }
        });

        if (!getData) throw new CustomError(httpCode.notFound, "Data Dospem tidak ditemukan")

        return getData;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getAllDataDospem,
    getByNidnDataDospem
}