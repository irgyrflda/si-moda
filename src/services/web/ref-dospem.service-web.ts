import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import RefDosepem, { RefDospemInput, RefDospemOutput } from "@models/ref-dospem.models";
import BimbinganMhs from "@models/bimbingan-mhs.models";
import db from "@config/database";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";
import { Op } from "sequelize";

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

const getByNidnDataDashboardDospem = async (
    nidn: string
) => {
    try {
        const getData: RefDosepem | null = await RefDosepem.findOne({
            where: {
                nidn: nidn
            }
        });

        if (!getData) throw new CustomError(httpCode.notFound, "Data Dospem tidak ditemukan")

        const dataCountSelesaiDiReview = await BimbinganMhs.findAll({
            attributes: [[db.fn('COUNT', db.col('id_bimbingan')), 'total_data']],
            include: [
                {
                    model: RefDosepemMhs,
                    as: 'dospem_tesis',
                    attributes: [],
                    where: {
                        nidn: nidn
                    }
                }
            ],
            where: {
                [Op.or]: [
                    {
                        status_persetujuan: "setuju"
                    },
                    {
                        status_persetujuan: "tidak setuju"
                    }
                ]
            }
        });

        const dataCountBelumDiReview = await BimbinganMhs.findAll({
            attributes: [[db.fn('COUNT', db.col('id_bimbingan')), 'total_data']],
            include: [
                {
                    model: RefDosepemMhs,
                    as: 'dospem_tesis',
                    attributes: [],
                    where: {
                        nidn: nidn
                    }
                }
            ],
            where: {
                status_persetujuan: "belum disetujui"
            }
        });

        const totalMhsBimbingan1 = await RefDosepemMhs.findAll({
            attributes: [[db.fn('COUNT', db.col('nidn')), 'total_data']],
            where: {
                nidn: nidn,
                keterangan_dospem: "dospem 1",
                status_persetujuan: "setuju"
            }
        })

        const totalMhsBimbingan2 = await RefDosepemMhs.findAll({
            attributes: [[db.fn('COUNT', db.col('nidn')), 'total_data']],
            where: {
                nidn: nidn,
                keterangan_dospem: "dospem 2",
                status_persetujuan: "setuju"
            }
        })

        const data = {
            selesai_review: dataCountSelesaiDiReview[0].get("total_data"),
            belum_direview: dataCountBelumDiReview[0].get("total_data"),
            total_mhs_dospem1: totalMhsBimbingan1[0].get("total_data"),
            total_mhs_dospem2: totalMhsBimbingan2[0].get("total_data"),
        }
        
        return data;
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
    getByNidnDataDospem,
    getByNidnDataDashboardDospem
}