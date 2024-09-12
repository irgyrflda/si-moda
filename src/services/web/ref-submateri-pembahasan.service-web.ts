import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import MateriPembahasan from "@models/materi-pembahasan.models";
import SubMateriPembahasan, { status_sub_materi, SubMateriPembahasanInput, SubMateriPembahasanOutput } from "@models/sub-materi-pembahasan.models";
import { httpCode } from "@utils/prefix";

const getAllSubMateriPembahasan = async (

): Promise<SubMateriPembahasanOutput[]> => {
    try {
        const getAll = await SubMateriPembahasan.findAll({
            attributes: ["id_sub_materi_pembahasan", "sub_materi_pembahasan", "status_sub_materi"],
            include:
            {
                model: MateriPembahasan,
                as: "materi",
                attributes: ["id_materi_pembahasan", "materi_pembahasan"]
            },
            raw: true
        });

        if (getAll.length === 0) throw new CustomError(httpCode.notFound, "Data Sub Materi Tidak Ditemukan")

        return getAll;
    } catch (error) {
        console.log("error : ", error);
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByIdSubmateriPembahasan = async (
    id_sub_materi_pembahasan: string
): Promise<SubMateriPembahasanOutput> => {
    try {
        const getAll = await SubMateriPembahasan.findOne({
            attributes: ["id_sub_materi_pembahasan", "sub_materi_pembahasan", "status_sub_materi"],
            include:
            {
                model: MateriPembahasan,
                as: "materi",
                attributes: ["id_materi_pembahasan", "materi_pembahasan"]
            },
            where: {
                id_sub_materi_pembahasan: id_sub_materi_pembahasan
            },
            raw: true
        });

        if (!getAll) throw new CustomError(httpCode.notFound, "Data Sub Materi Tidak Ditemukan")

        return getAll;
    } catch (error) {
        console.log("error : ", error);
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeSubMateriPembahasan = async (
    idMateriPembahasan: number,
    sub_materi_pembahasan: string,
    statusSubMateri: status_sub_materi
): Promise<SubMateriPembahasanInput> => {
    try {
        const cekId = await MateriPembahasan.findOne({
            where: {
                id_materi_pembahasan: idMateriPembahasan
            }
        });
        
        if (!cekId) throw new CustomError(httpCode.notFound, "Data Materi Pembahasan Tidak Ditemukan")

        const payload: SubMateriPembahasanInput = {
            id_materi_pembahasan: idMateriPembahasan,
            sub_materi_pembahasan: sub_materi_pembahasan,
            status_sub_materi: statusSubMateri
        }
        const storeMateri = await SubMateriPembahasan.create(payload)

        if (!storeMateri) throw new CustomError(httpCode.badRequest, "Gagal membuat data")

        return storeMateri;
    } catch (error) {
        console.log("error : ", error);
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updateSubMateriPembahasan = async (
    idSubMateri: string,
    idMateri: number,
    sub_materi_pembahasan: string,
    status_sub_materi: status_sub_materi
) => {
    try {
        const cekSubId = await SubMateriPembahasan.findOne({
            where: {
                id_sub_materi_pembahasan: idSubMateri
            }
        });

        if (!cekSubId) throw new CustomError(httpCode.notFound, "Data Sub Materi Pembahasan Tidak Ditemukan")

        const cekId = await MateriPembahasan.findOne({
            where: {
                id_materi_pembahasan: idMateri
            }
        });

        if (!cekId) throw new CustomError(httpCode.notFound, "Data Materi Pembahasan Tidak Ditemukan")

        const payload: SubMateriPembahasanInput = {
            id_materi_pembahasan: idMateri,
            sub_materi_pembahasan: sub_materi_pembahasan,
            status_sub_materi: status_sub_materi
        }

        const updateMateri = await SubMateriPembahasan.update(payload, {
            where: {
                id_sub_materi_pembahasan: idSubMateri
            }
        })

        if (!updateMateri) throw new CustomError(httpCode.badRequest, "Gagal mengubah data")

        return updateMateri;
    } catch (error) {
        console.log("error : ", error);
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const deleteSubMateriPembahasan = async (
    idSubMateri: string,
) => {
    try {
        const cekId = SubMateriPembahasan.findOne({
            where: {
                id_sub_materi_pembahasan: idSubMateri
            }
        });

        if (!cekId) throw new CustomError(httpCode.notFound, "Data Sub Materi Pembahasan Tidak Ditemukan")

        const deleteMateri = await SubMateriPembahasan.destroy({
            where: {
                id_sub_materi_pembahasan: idSubMateri
            }
        })

        if (!deleteMateri) throw new CustomError(httpCode.badRequest, "Gagal menghapus data")

        return deleteMateri;
    } catch (error) {
        console.log("error : ", error);
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getAllSubMateriPembahasan,
    getByIdSubmateriPembahasan,
    storeSubMateriPembahasan,
    updateSubMateriPembahasan,
    deleteSubMateriPembahasan
}