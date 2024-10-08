import db from "@config/database"
import CustomError from "@middleware/error-handler"
import Status from "@models/ref-status.models"
import RefTesisMhs from "@models/ref-tesis-mhs.models"
import { httpCode } from "@utils/prefix"
import { QueryTypes } from "sequelize"
import trxNotifikasiServiceWeb from "./trx-notifikasi.service-web"

const updateStatusTesisMhs = async (
    kode_status: string,
    nim: string
) => {
    const checkStatus = await Status.findOne({
        attributes: ["keterangan_status"],
        where: {
            kategori_status: "capaian_tesis_mhs",
            kode_status: kode_status
        }
    })

    await RefTesisMhs.update({
        kode_status: kode_status
    }, {
        where: {
            nim: nim
        }
    })

    return checkStatus?.keterangan_status
}

const updateStatusCapaianBimbinganProposalMhs = async (
    nim: string
) => {
    const checkData: any = await db.query(`SELECT COUNT(b.id_dospem_mhs) total_dosen_setuju
        FROM ref_tesis_mahasiswa a
        JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        WHERE b.status_persetujuan = 'setuju'
        AND a.nim = :nim`,
        {
            replacements: { nim: nim },
            type: QueryTypes.SELECT
        }
    );

    let status: string = "T01"

    if (checkData[0].total_dosen_setuju === 0) status = "T01"
    if (checkData[0].total_dosen_setuju === 2) status = "T04"
    if (checkData[0].total_dosen_setuju === 1) status = "T02"

    await RefTesisMhs.update({
        kode_status: status
    }, {
        where: {
            nim: nim
        }
    })
}

const updateStatusCapaianSeminarProposalMhs = async (
    nim: string,
) => {
    const checkData: any = await db.query(`SELECT a.id_sub_materi_pembahasan, b.id_sub_materi_pembahasan validasi
    FROM (SELECT b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
    FROM ref_materi_pembahasan a
    JOIN ref_sub_materi_pembahasan b
    ON a.id_materi_pembahasan = b.id_materi_pembahasan
    WHERE a.materi_pembahasan IN ('BAB I', 'BAB II', 'BAB III')
    AND b.status_sub_materi = 'required') a
    LEFT JOIN (SELECT a.id_sub_materi_pembahasan
    FROM (SELECT a.id_trx_bimbingan, a.id_sub_materi_pembahasan,
    CASE 
    WHEN COUNT(*) = 2 AND SUM(b.status_persetujuan = 'setuju') = 2 THEN 1
    ELSE 0 
    END AS hasil_validasi
    FROM trx_bimbingan_mhs a
    JOIN ref_bimbingan_mhs b
    ON a.id_trx_bimbingan = b.id_trx_bimbingan 
    WHERE nim = :nim
    AND a.id_trx_bimbingan IN (SELECT MAX(id_trx_bimbingan)
    FROM trx_bimbingan_mhs 
    WHERE nim = :nim
    GROUP BY id_sub_materi_pembahasan)
    GROUP BY id_sub_materi_pembahasan) a
    WHERE a.hasil_validasi = 1) b
    ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan`,
        {
            replacements: { nim: nim },
            type: QueryTypes.SELECT
        }
    );

    let status: string = "T04"

    const checkDataMhs: boolean = checkData.some((items: any) => !items.validasi)
    console.log("checkData : ", checkData);
    console.log("checkDataMhs : ", checkDataMhs);

    if (checkDataMhs === false) {
        status = "T05"
        await trxNotifikasiServiceWeb.createNotif(nim, 'Bimbingan Proposal Anda Telah Disetujui Oleh Kedua Dospem, Silahkan Upload Materi Proposal Anda!!')
    }

    console.log("status baru : ", status);

    await RefTesisMhs.update({
        kode_status: status
    }, {
        where: {
            nim: nim
        }
    })
}

const updateStatusCapaianBimbinganHasilMhs = async (
    nim: string,
) => {
    const checkData: any = await db.query(`SELECT COUNT(id_trx_seminar) total_masukan
    FROM (SELECT b.id_trx_seminar, b.id_dospem_mhs
    FROM trx_seminar_mhs a
    JOIN trx_masukan_seminar b
    ON a.id_trx_seminar = b.id_trx_seminar
    WHERE a.nim = :nim
    AND a.keterangan_seminar = 'proposal'
    GROUP BY b.id_dospem_mhs) a`,
        {
            replacements: { nim: nim },
            type: QueryTypes.SELECT
        }
    );

    let status: string = "T06"

    if (checkData[0].total_masukan === 2) {
        status = "T07"
        await trxNotifikasiServiceWeb.createNotif(nim, 'Seminar Proposal Anda Telah Diberimasukan Oleh Kedua Dospem, Silahkan Revisi Proposal Anda!!, Semangat Revisi!!')
    }

    console.log("status baru : ", status);

    await RefTesisMhs.update({
        kode_status: status
    }, {
        where: {
            nim: nim
        }
    })
}

const updateStatusCapaianBimbinganSidangAkhirMhs = async (
    nim: string,
) => {
    const checkData: any = await db.query(`SELECT COUNT(id_trx_seminar) total_masukan
    FROM (SELECT b.id_trx_seminar, b.id_dospem_mhs
    FROM trx_seminar_mhs a
    JOIN trx_masukan_seminar b
    ON a.id_trx_seminar = b.id_trx_seminar
    WHERE a.nim = :nim
    AND a.keterangan_seminar = 'hasil'
    GROUP BY b.id_dospem_mhs) a`,
        {
            replacements: { nim: nim },
            type: QueryTypes.SELECT
        }
    );

    let status: string = "T09"

    if (checkData[0].total_masukan === 2) {
        status = "T10"
        await trxNotifikasiServiceWeb.createNotif(nim, 'Seminar Hasil Anda Telah Diberimasukan Oleh Kedua Dospem, Silahkan Revisi Hasil Penelitian Anda!!, Semangat Revisi!!')
    }

    console.log("status baru : ", status);

    await RefTesisMhs.update({
        kode_status: status
    }, {
        where: {
            nim: nim
        }
    })
}

const updateStatusCapaianSeminarHasilMhs = async (
    nim: string,
) => {
    const checkData: any = await db.query(`SELECT a.id_sub_materi_pembahasan, b.id_sub_materi_pembahasan validasi
    FROM (SELECT b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
    FROM ref_materi_pembahasan a
    JOIN ref_sub_materi_pembahasan b
    ON a.id_materi_pembahasan = b.id_materi_pembahasan
    WHERE a.materi_pembahasan IN ('BAB I', 'BAB II', 'BAB III', 'BAB IV', 'BAB V', 'BAB VI')
    AND b.status_sub_materi = 'required') a
    LEFT JOIN (SELECT a.id_sub_materi_pembahasan
    FROM (SELECT a.id_trx_bimbingan, a.id_sub_materi_pembahasan,
    CASE 
    WHEN COUNT(*) = 2 AND SUM(b.status_persetujuan = 'setuju') = 2 THEN 1
    ELSE 0 
    END AS hasil_validasi
    FROM trx_bimbingan_mhs a
    JOIN ref_bimbingan_mhs b
    ON a.id_trx_bimbingan = b.id_trx_bimbingan 
    WHERE nim = :nim
    AND a.id_trx_bimbingan IN (SELECT MAX(id_trx_bimbingan)
    FROM trx_bimbingan_mhs 
    WHERE nim = :nim
    GROUP BY id_sub_materi_pembahasan)
    GROUP BY id_sub_materi_pembahasan) a
    WHERE a.hasil_validasi = 1) b
    ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan`,
        {
            replacements: { nim: nim },
            type: QueryTypes.SELECT
        }
    );

    let status: string = "T07"

    const checkDataMhs: boolean = checkData.some((items: any) => !items.validasi)

    if (checkDataMhs === false) {
        status = "T08"
        await trxNotifikasiServiceWeb.createNotif(nim, 'Bimbingan Hasil Anda Telah Disetujui Oleh Kedua Dospem, Silahkan Upload Materi Hasil Anda!!')
    }

    await RefTesisMhs.update({
        kode_status: status
    }, {
        where: {
            nim: nim
        }
    })
}

const updateStatusCapaianSeminarSidangAkhirMhs = async (
    id_trx_seminar: string,
) => {
    const checkData: any = await db.query(`SELECT a.nim, b.status_persetujuan
    FROM trx_seminar_mhs a
    JOIN ref_seminar_mhs b
    ON a.id_trx_seminar = b.id_trx_seminar
    WHERE a.id_trx_seminar = :id_trx_seminar
`,
        {
            replacements: { id_trx_seminar: id_trx_seminar },
            type: QueryTypes.SELECT
        }
    );

    let status: string = "T11"

    const statusNeww = checkData.filter((i: any) => i.status_persetujuan === 'tidak setuju')
    const statusPersetujuan = checkData.filter((i: any) => i.status_persetujuan === 'setuju')
    const nim = checkData[0].nim
    
    if (statusPersetujuan.length === 2) {
        status = "T12"
        await trxNotifikasiServiceWeb.createNotif(nim, 'Ujian Akhir Anda Disetujui Oleh Kedua Dospem')
    } else if (statusNeww.length > 0 && statusNeww.length <= 2) {
        status = "T10"
    } else if (statusPersetujuan.length > 0 && statusPersetujuan.length < 2) {
        status = "T11"
    } else {
        status = "T11"
    }

    console.log("status baru : ", status);

    await RefTesisMhs.update({
        kode_status: status
    }, {
        where: {
            nim: nim
        }
    })
}

export default {
    updateStatusTesisMhs,
    updateStatusCapaianBimbinganProposalMhs,
    updateStatusCapaianSeminarProposalMhs,
    updateStatusCapaianSeminarHasilMhs,
    updateStatusCapaianBimbinganHasilMhs,
    updateStatusCapaianBimbinganSidangAkhirMhs,
    updateStatusCapaianSeminarSidangAkhirMhs
}