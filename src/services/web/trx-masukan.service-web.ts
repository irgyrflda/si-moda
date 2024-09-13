import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import { debugLogger } from "@config/logger";
import TrxMasukanDsn, { TrxMasukanDsnInput } from "@models/trx-masukan-dospem.models";
import db from "@config/database";
import { QueryTypes } from "sequelize";
import BimbinganMhs from "@models/bimbingan-mhs.models";

const getMasukanByIdTrxBimbingan = async (
    idTrxBimbingan: string,
) => {
    try {
        const getMasukanDsn = await db.query(`SELECT a.masukan, b.id_dospem_mhs, b.keterangan_dospem, b.nidn, 
        c.nama_dospem
        FROM trx_masukan_dospem a
        JOIN ref_dospem_mhs b
        ON a.id_dospem_mhs = b.id_dospem_mhs
        JOIN ref_dospem c
        ON b.nidn = c.nidn
        WHERE a.id_trx_bimbingan = :id_trx_bimbingan
        AND b.status_persetujuan = 'setuju'`, {
            replacements: { id_trx_bimbingan: idTrxBimbingan },
            type: QueryTypes.SELECT
        })

        if (getMasukanDsn.length === 0) throw new CustomError(httpCode.notFound, "Tidak ada masukan dospem")

        return getMasukanDsn
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeMasukanTrxBimbingan = async (
    idTrxBimbingan: number,
    id_dospem_mhs: number,
    masukan: string
) => {
    try {
        const checkTrxBimbingan = await BimbinganMhs.findOne({
            attributes: ["id_dospem_mhs"],
            where: {
                id_trx_bimbingan: idTrxBimbingan,
                id_dospem_mhs: id_dospem_mhs
            }
        });

        if(!checkTrxBimbingan) throw new CustomError(httpCode.notFound, "Data yang anda berimasukan tidak ditemukan")

        const payload : TrxMasukanDsnInput = {
            id_trx_bimbingan: idTrxBimbingan,
            id_dospem_mhs: id_dospem_mhs,
            masukan: masukan
        }

        console.log("masukan : ", payload);
        
        const storeMasukan = await TrxMasukanDsn.create(payload)

        if(!storeMasukan) throw new CustomError(httpCode.badRequest, "Gagal membuat data")

        return storeMasukan
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
    getMasukanByIdTrxBimbingan,
    storeMasukanTrxBimbingan
}