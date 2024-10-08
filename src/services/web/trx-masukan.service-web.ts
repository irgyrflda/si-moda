import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import { debugLogger } from "@config/logger";
import TrxMasukanDsn, { TrxMasukanDsnInput } from "@models/trx-masukan-dospem.models";
import db from "@config/database";
import { QueryTypes, where } from "sequelize";
import BimbinganMhs from "@models/bimbingan-mhs.models";
import SeminarMhs from "@models/ref-seminar-mhs.models";
import TrxMasukanSeminar, { TrxMasukanSeminarInput } from "@models/trx-masukan-seminar.model";
import serviceNotif from "@services/web/trx-notifikasi.service-web";
import { cekTgl } from "@utils/cek-tgl";
import TrxSeminarMhs, { keterangan_seminar } from "@models/trx-seminar-mhs.models";
import TrxBimbinganMhs from "@models/trx-bimbingan-mhs.models";
import statusMhsServiceWeb from "./status-mhs.service-web";

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

const getMasukanByIdTrxBimbinganAndNidn = async (
    idTrxBimbingan: string,
    nidn: string
) => {
    try {
        const getMasukanDsn = await db.query(`SELECT a.id_trx_masukan, a.masukan, b.id_dospem_mhs, 
        b.keterangan_dospem, b.nidn, c.nama_dospem
        FROM trx_masukan_dospem a
        JOIN ref_dospem_mhs b
        ON a.id_dospem_mhs = b.id_dospem_mhs
        JOIN ref_dospem c
        ON b.nidn = c.nidn
        WHERE a.id_trx_bimbingan = :id_trx_bimbingan
        AND c.nidn = :nidn
        AND b.status_persetujuan = 'setuju'`, {
            replacements: { id_trx_bimbingan: idTrxBimbingan, nidn: nidn },
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

const getMasukanByIdTrxSeminarAndIdDospemMhs = async (
    idTrxSeminar: string,
    idDospemMhs: string
) => {
    try {
        const getMasukanDsn = await db.query(`SELECT a.id_trx_masukan_seminar, a.masukan, b.id_dospem_mhs, 
        b.keterangan_dospem, b.nidn, c.nama_dospem
        FROM trx_masukan_seminar a
        JOIN ref_dospem_mhs b
        ON a.id_dospem_mhs = b.id_dospem_mhs
        JOIN ref_dospem c
        ON b.nidn = c.nidn
        WHERE a.id_trx_seminar = :id_trx_seminar
        AND b.id_dospem_mhs = :id_dospem_mhs
        AND b.status_persetujuan = 'setuju'`, {
            replacements: { id_trx_seminar: idTrxSeminar, id_dospem_mhs: idDospemMhs },
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
    masukan: string,
    tgl_review: string
) => {
    const t = await db.transaction()
    try {
        const checkTgl = cekTgl(tgl_review);

        if (checkTgl === false) throw new CustomError(httpCode.badRequest, "Pastikan format tgl_upload YYYY-MM-DD HH:MM:SS")

        const checkTrxBimbingan = await BimbinganMhs.findOne({
            attributes: ["id_dospem_mhs"],
            where: {
                id_trx_bimbingan: idTrxBimbingan,
                id_dospem_mhs: id_dospem_mhs
            }
        });

        if (!checkTrxBimbingan) throw new CustomError(httpCode.notFound, "Data yang anda berimasukan tidak ditemukan")

        const payload: TrxMasukanDsnInput = {
            id_trx_bimbingan: idTrxBimbingan,
            id_dospem_mhs: id_dospem_mhs,
            masukan: masukan
        }

        const storeMasukan = await TrxMasukanDsn.create(payload, { transaction: t })

        if (!storeMasukan) throw new CustomError(httpCode.badRequest, "Gagal membuat data[0]")

        const updateTglBimbingan = await TrxBimbinganMhs.update({
            tgl_review: tgl_review
        }, {
            where: {
                id_trx_bimbingan: idTrxBimbingan
            },
            transaction: t
        });

        if (!updateTglBimbingan) throw new CustomError(httpCode.badRequest, "Gagal membuat data[1]")

        const updateTglDetail = await BimbinganMhs.update({
            tgl_detail_review: tgl_review
        }, {
            where: {
                id_trx_bimbingan: idTrxBimbingan,
                id_dospem_mhs: id_dospem_mhs
            },
            transaction: t
        });

        if (!updateTglDetail) throw new CustomError(httpCode.badRequest, "Gagal membuat data[2]")

        t.commit();
        return storeMasukan
    } catch (error) {
        t.rollback()
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeMasukanTrxSeminar = async (
    idTrxSeminar: number,
    id_dospem_mhs: number,
    masukan: string,
    tgl_detail_review: string
) => {
    const t = await db.transaction();
    try {
        const cekPayloadTgl = cekTgl(tgl_detail_review)

        if (cekPayloadTgl === false) throw new CustomError(httpCode.badRequest, "Pastikan format tgl_upload YYYY-MM-DD HH:MM:SS")
        const checkTrx: any = await SeminarMhs.findAll({
            attributes: ["id_dospem_mhs"],
            include: [
                {
                    model: TrxSeminarMhs,
                    as: "seminar_tesis_mhs",
                    attributes: ["nim", "keterangan_seminar"]
                }
            ],
            where: {
                id_trx_seminar: idTrxSeminar,
                id_dospem_mhs: id_dospem_mhs
            }
        });

        if (checkTrx.length === 0) throw new CustomError(httpCode.notFound, "Data yang anda berimasukan tidak ditemukan")

        const payload: TrxMasukanSeminarInput = {
            id_trx_seminar: idTrxSeminar,
            id_dospem_mhs: id_dospem_mhs,
            masukan: masukan
        }

        const storeMasukan = await TrxMasukanSeminar.create(payload, { transaction: t })

        if (!storeMasukan) throw new CustomError(httpCode.badRequest, "Gagal membuat data")

        const updateDetailReview = await SeminarMhs.update({
            tgl_detail_review: tgl_detail_review
        }, {
            where: {
                id_dospem_mhs: id_dospem_mhs,
                id_trx_seminar: idTrxSeminar
            },
            transaction: t
        })
        if (!updateDetailReview) throw new CustomError(httpCode.badRequest, "Gagal membuat data[1]")

        const updateTrx = await TrxSeminarMhs.update({
            tgl_review: tgl_detail_review
        }, {
            where: {
                id_trx_seminar: idTrxSeminar
            },
            transaction: t
        })

        if (!updateTrx) throw new CustomError(httpCode.badRequest, "Gagal membuat data[2]")

        await serviceNotif.createNotif(checkTrx[0].seminar_tesis_mhs.nim, `Seminar ${checkTrx[0].seminar_tesis_mhs.keterangan_seminar} telah dikomentari`)

        t.commit()

        if (checkTrx[0].seminar_tesis_mhs.keterangan_seminar === keterangan_seminar.proposal) {
            await statusMhsServiceWeb.updateStatusCapaianBimbinganHasilMhs(checkTrx[0].seminar_tesis_mhs.nim)
        }

        if (checkTrx[0].seminar_tesis_mhs.keterangan_seminar === keterangan_seminar.hasil) {
            await statusMhsServiceWeb.updateStatusCapaianBimbinganSidangAkhirMhs(checkTrx[0].seminar_tesis_mhs.nim)
        }
        return storeMasukan
    } catch (error) {
        t.rollback()
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
    storeMasukanTrxBimbingan,
    storeMasukanTrxSeminar,
    getMasukanByIdTrxSeminarAndIdDospemMhs,
    getMasukanByIdTrxBimbinganAndNidn
}