import CustomError from "@middleware/error-handler";
import MateriPembahasan, { MateriPembahasanInput, MateriPembahasanOutput } from "@models/materi-pembahasan.models";
import SubMateriPembahasan from "@models/sub-materi-pembahasan.models";
import { httpCode } from "@utils/prefix";

const getAllmateriPembahasan = async (

): Promise<MateriPembahasanOutput[]> => {
    try {
        const getAll = await MateriPembahasan.findAll({
            attributes: ["id_materi_pembahasan", "materi_pembahasan"],
            include: [
                {
                    model: SubMateriPembahasan,
                    as: "sub_materi",
                    attributes: ["id_sub_materi_pembahasan", "sub_materi_pembahasan", "status_sub_materi"]
                }
            ]
        });

        if (getAll.length === 0) throw new CustomError(httpCode.notFound, "Data Materi Tidak Ditemukan")

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

const getByIdmateriPembahasan = async (
    id_materi_pembahasan: string
): Promise<MateriPembahasanOutput> => {
    try {
        const getAll = await MateriPembahasan.findOne({
            attributes: ["id_materi_pembahasan", "materi_pembahasan"],
            include: [
                {
                    model: SubMateriPembahasan,
                    as: "sub_materi",
                    attributes: ["id_sub_materi_pembahasan", "sub_materi_pembahasan", "status_sub_materi"]
                }
            ],
            where: {
                id_materi_pembahasan: id_materi_pembahasan
            }
        });

        if (!getAll) throw new CustomError(httpCode.notFound, "Data Materi Tidak Ditemukan")

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

const storeMateriPembahasan = async (
    materiPembahasan: string
): Promise<MateriPembahasanInput> => {
    try {
        const payload: MateriPembahasanInput = {
            materi_pembahasan: materiPembahasan
        }
        const storeMateri = await MateriPembahasan.create(payload)

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

const updateMateriPembahasan = async (
    idMateri: string,
    materiPembahasan: string
) => {
    try {
        const cekId = MateriPembahasan.findOne({
            where: {
                id_materi_pembahasan: idMateri
            }
        });

        if (!cekId) throw new CustomError(httpCode.notFound, "Data Materi Pembahasan Tidak Ditemukan")

        const payload: MateriPembahasanInput = {
            materi_pembahasan: materiPembahasan
        }

        const updateMateri = await MateriPembahasan.update(payload, {
            where: {
                id_materi_pembahasan: idMateri
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

const deleteMateriPembahasan = async (
    idMateri: string,
) => {
    try {
        const cekId = MateriPembahasan.findOne({
            where: {
                id_materi_pembahasan: idMateri
            }
        });

        if (!cekId) throw new CustomError(httpCode.notFound, "Data Materi Pembahasan Tidak Ditemukan")

        const deleteMateri = await MateriPembahasan.destroy({
            where: {
                id_materi_pembahasan: idMateri
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
    getAllmateriPembahasan,
    getByIdmateriPembahasan,
    storeMateriPembahasan,
    updateMateriPembahasan,
    deleteMateriPembahasan
}