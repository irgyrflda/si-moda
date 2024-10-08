import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import RefDosepem from "@models/ref-dospem.models";
import Status from "@models/ref-status.models";
import RefTesisMhs from "@models/ref-tesis-mhs.models";
import { httpCode } from "@utils/prefix";
import siaServiceWeb from "./sia.service-web";
import db from "@config/database";
import { and, QueryTypes } from "sequelize";

const profileMhsByNidnKetDospem = async (
    nidn: string,
    keteranganDospem: string
) => {
    try {
        const getDataTesisMhs: any = await db.query(`SELECT a.nim, c.nama_user, a.keterangan_dospem,
        b.judul_tesis, b.kode_status, d.keterangan_status, 
        c.email_google, c.email_ecampus, CONCAT(ROUND(((d.no_urut / (SELECT COUNT(a.kode_status) 
        FROM ref_status a
        WHERE a.kategori_status = 'capaian_tesis_mhs')) * 100), 0), "%") capaian_kelulusan,
        '100%' dari
        FROM ref_dospem_mhs a
        JOIN ref_tesis_mahasiswa b
        ON a.nim = b.nim
        JOIN ref_user c
        ON a.nim = c.nomor_induk
        LEFT JOIN (SELECT a.kode_status, a.keterangan_status, 
        ROW_NUMBER() OVER (ORDER BY kode_status) no_urut
        FROM ref_status a
        WHERE a.kategori_status = 'capaian_tesis_mhs') d
        ON b.kode_status = d.kode_status
        WHERE a.nidn = :nidn
        AND a.keterangan_dospem = :keterangan_dospem
        AND a.status_persetujuan = 'setuju'`,
            {
                replacements: { nidn: nidn, keterangan_dospem: keteranganDospem },
                type: QueryTypes.SELECT
            })

        if (getDataTesisMhs.length === 0) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tidak Ditemukan")

        let dataNew: any[] = []
        await Promise.all(
            getDataTesisMhs.map(async (i: any) => {
                const getDataMhs = await siaServiceWeb.getDataMhsByNim(i.nim)
                const capaianMhs : string = (!i.capaian_kelulusan) ? "0%" : i.capaian_kelulusan
                dataNew.push({
                    nama_mahasiswa: getDataMhs.nama,
                    nim: i.nim,
                    judul_tesis: i.judul_tesis,
                    Prodi: getDataMhs.jurusan,
                    ipk: getDataMhs.ipk,
                    semester: getDataMhs.semester,
                    ips: getDataMhs.ips_per_semester,
                    angkatan: getDataMhs.angkatan,
                    status_bimbingan: i.keterangan_status,
                    email_google: i.email_google,
                    email_ecampus: i.email_ecampus,
                    capaian_kelulusan: capaianMhs,
                    dari: '100%'
                })
            })
        )

        return dataNew;
    } catch (error: any) {
        console.log("error get data profile by nim : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const profileMhsByNim = async (
    nim: string
) => {
    try {
        const getDataTesisMhs = await RefTesisMhs.findOne({
            attributes: ["nim", "judul_tesis"],
            include: [
                {
                    model: Status,
                    as: "status",
                    attributes: ["kode_status", "keterangan_status"]
                }
            ],
            where: {
                nim: nim
            }
        });

        if (!getDataTesisMhs) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tidak Ditemukan")

        const getCapaianMhs: any = await db.query(`SELECT c.email_google, c.email_ecampus, CONCAT(ROUND(((d.no_urut / (SELECT COUNT(a.kode_status) 
        FROM ref_status a
        WHERE a.kategori_status = 'capaian_tesis_mhs')) * 100), 0), "%") capaian_kelulusan,
        '100%' dari
        FROM ref_tesis_mahasiswa b
        JOIN ref_user c
        ON b.nim = c.nomor_induk
        LEFT JOIN (SELECT a.kode_status, a.keterangan_status, 
        ROW_NUMBER() OVER (ORDER BY kode_status) no_urut
        FROM ref_status a
        WHERE a.kategori_status = 'capaian_tesis_mhs') d
        ON b.kode_status = d.kode_status
        WHERE b.nim = :nim`, {
            replacements: { nim: nim },
            type: QueryTypes.SELECT
        })

        const capaianMhs = (getCapaianMhs.length === 0) ? "0%" : getCapaianMhs[0]?.capaian_kelulusan

        const getDataMhs = await siaServiceWeb.getDataMhsByNim(nim)
        const statusMhs: any = getDataTesisMhs.get("status")
        const dataNew: any = {
            nama_mahasiswa: getDataMhs.nama,
            nim: nim,
            judul_tesis: getDataTesisMhs.judul_tesis,
            Prodi: getDataMhs.jurusan,
            ipk: getDataMhs.ipk,
            semester: getDataMhs.semester,
            ips: getDataMhs.ips_per_semester,
            angkatan: getDataMhs.angkatan,
            status_bimbingan: statusMhs.keterangan_status,
            email_google: getCapaianMhs[0].email_google,
            email_ecampus: getCapaianMhs[0].email_ecampus,
            capaian_kelulusan: capaianMhs,
            dari: '100%'
        }

        return dataNew;
    } catch (error: any) {
        console.log("error get data profile by nim : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const profileDsnByNidn = async (
    nidn: string
) => {
    try {
        const getDataTesisMhs = await RefDosepem.findOne({
            attributes: ["nidn", "nama_dospem"],
            where: {
                nidn: nidn
            }
        });

        if (!getDataTesisMhs) throw new CustomError(httpCode.notFound, "Data Dosen Tidak Ditemukan")

        const getDataDsn = await siaServiceWeb.getDataDsnByNidn(nidn)
        const dataNew: any = {
            nama_dosen: getDataDsn.nama,
            nomor_induk_dosen_nasional: nidn,
            jabatan: getDataDsn.jabatan,
            Prodi: getDataDsn.departemen,
            pendidikan_terakhir: getDataDsn.pendidikan_terakhir,
            tahun_masuk: getDataDsn.tahun_masuk,
            status: getDataDsn.status,
            matakuliah: getDataDsn.mata_kuliah
        }

        return dataNew;
    } catch (error: any) {
        console.log("error get data profile by nidn : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    profileMhsByNim,
    profileDsnByNidn,
    profileMhsByNidnKetDospem
}