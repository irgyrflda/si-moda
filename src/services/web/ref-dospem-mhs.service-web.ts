import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import RefDosepemMhs, { RefDospemMhsInput, RefDospemMhsOutput, status_persetujuan_dospem_mhs, keterangan_dospem } from "@models/ref-dospem-mhs.models";
import { PayloadRequest } from "@schema/ref-dospem-mhs.schema";
import RefDosepem from "@models/ref-dospem.models";
import RefTesisMhs from "@models/ref-tesis-mhs.models";
import { Op } from "sequelize";

const getByIdDataDospemMhs = async (
    id_dospem_mhs: string
): Promise<RefDospemMhsOutput> => {
    try {
        const getData = await RefDosepemMhs.findOne({
            where: {
                id_dospem_mhs: id_dospem_mhs
            }
        })

        if (!getData) throw new CustomError(httpCode.notFound, "Data tidak ditemukan")

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

const getByNimDataDospemMhs = async (
    nim: string
): Promise<RefDospemMhsOutput[]> => {
    try {
        const getData = await RefDosepemMhs.findAll({
            where: {
                nim: nim,
                [Op.or]: [
                    {
                        status_persetujuan: status_persetujuan_dospem_mhs.setuju
                    },
                    {
                        status_persetujuan: status_persetujuan_dospem_mhs.belum
                    }
                ]
            }
        })

        if (getData.length === 0) throw new CustomError(httpCode.notFound, "Mahasiswa bimbingan belum mendapatkan dosen pembimbing")

        const cekPersetujuanDospem = getData.some((i: any) => i.status_persetujuan === status_persetujuan_dospem_mhs.belum)

        if(cekPersetujuanDospem === true) throw new CustomError(httpCode.found, "Ada dospem yang belum disetujui")
            
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

const storeDataDospemMhs = async (
    request: PayloadRequest["body"]
): Promise<RefDospemMhsInput> => {
    try {
        const cekDospem = await RefDosepem.findOne({
            where: {
                nidn: request.nidn
            }
        })

        if (!cekDospem) throw new CustomError(httpCode.notFound, "Dospem Tidak Terdaftar")

        const cekMhs = await RefTesisMhs.findOne({
            where: {
                nim: request.nim
            }
        })

        if (!cekMhs) throw new CustomError(httpCode.notFound, "Mahasiswa Tidak Terdaftar")

        const cekDospemMhs = await RefDosepemMhs.findAll({
            attributes: ["nidn", "keterangan_dospem", "status_persetujuan"],
            where: {
                nim: request.nim,
                [Op.or]: [
                    {
                        status_persetujuan: status_persetujuan_dospem_mhs.setuju
                    },
                    {
                        status_persetujuan: status_persetujuan_dospem_mhs.belum
                    }
                ]
            }
        });

        if (cekDospemMhs.length > 1) throw new CustomError(httpCode.alreadyReported, "Dospem pada mahasiswa tersebut sudah dua")
        console.log(cekDospemMhs.some((i: any) => i.keterangan_dospem === request.keterangan_dospem));
        
        const checkData = (cekDospemMhs.length) ? cekDospemMhs.some((i: any) => i.keterangan_dospem === request.keterangan_dospem) : false;

        if (checkData === true) throw new CustomError(httpCode.conflict, `${request.keterangan_dospem} sudah terdaftar`)

        const payload: RefDospemMhsInput = {
            nidn: request.nidn,
            nim: request.nim,
            keterangan_dospem: request.keterangan_dospem,
            status_persetujuan: status_persetujuan_dospem_mhs.setuju
        }

        const store = await RefDosepemMhs.create(payload)

        if (!store) throw new CustomError(httpCode.badRequest, "Gagal Membuat data")

        return store;
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
    getByIdDataDospemMhs,
    getByNimDataDospemMhs,
    storeDataDospemMhs
}