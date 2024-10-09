import db from "@config/database";
import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import BimbinganMhs, { status_persetujuan_dospem_mhs } from "@models/bimbingan-mhs.models";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";
import RefDosepem from "@models/ref-dospem.models";
import SeminarMhs from "@models/ref-seminar-mhs.models";
import TrxBimbinganMhs, { TrxBimbinganMhsInput, TrxBimbinganMhsOutput } from "@models/trx-bimbingan-mhs.models";
import TrxMasukanSeminar from "@models/trx-masukan-seminar.model";
import TrxSeminarMhs, { keterangan_seminar, TrxSeminarMhsInput } from "@models/trx-seminar-mhs.models";
import { cekTgl } from "@utils/cek-tgl";
import { httpCode } from "@utils/prefix";
import { removeFile } from "@utils/remove-file";
import { QueryTypes, Op, fn, col } from "sequelize";
import serviceNotif from "@services/web/trx-notifikasi.service-web";
import RefTesisMhs from "@models/ref-tesis-mhs.models";
import statusMhsServiceWeb from "./status-mhs.service-web";

const getDataBimbinganByNim = async (
    nim: string
) => {
    try {
        const getBimbingan = await db.query(`SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            a.id_sub_materi_pembahasan, a.sub_materi_pembahasan, a.status_sub_materi,
            b.id_trx_bimbingan, b.nim, b.url_path_doc, b.tgl_upload, b.tgl_review
            FROM (SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
            FROM ref_materi_pembahasan a
            JOIN ref_sub_materi_pembahasan b
            ON a.id_materi_pembahasan = b.id_materi_pembahasan) a
            LEFT JOIN (SELECT id_trx_bimbingan, nim, id_sub_materi_pembahasan,
            url_path_doc, tgl_upload, tgl_review
            FROM trx_bimbingan_mhs 
            WHERE nim = :nim
            AND id_trx_bimbingan IN (SELECT MAX(id_trx_bimbingan) 
            FROM trx_bimbingan_mhs 
            WHERE nim = :nim
            GROUP BY id_sub_materi_pembahasan )) b
            ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan`,
            {
                replacements: { nim: nim },
                type: QueryTypes.SELECT
            }
        );

        if (getBimbingan.length === 0) throw new CustomError(httpCode.notFound, "materi bimbingan tidak ditemukan")

        const getPersetujuanDosepemByNim = await TrxBimbinganMhs.findAll({
            attributes: ['id_trx_bimbingan'],
            include: [
                {
                    model: BimbinganMhs,
                    as: "dospem_tasis_mhs",
                    attributes: ['id_bimbingan', 'status_persetujuan', 'tgl_detail_review'],
                    include: [
                        {
                            model: RefDosepemMhs,
                            as: "dospem_tesis",
                            attributes: ["keterangan_dospem", "id_dospem_mhs"]
                        }
                    ]
                }
            ],
            where: {
                nim: nim,
                id_trx_bimbingan: {
                    [Op.in]: db.literal(`
                      (SELECT MAX(id_trx_bimbingan) FROM trx_bimbingan_mhs 
                      WHERE nim = '${nim}' GROUP BY id_sub_materi_pembahasan)
                    `)
                }
            }
        });

        let dataArr: any[] = []

        Promise.all(
            getPersetujuanDosepemByNim.map((i: any) => {
                const belumSesuai = 'Belum Sesuai'
                const belumDiReview = 'Belum direview'
                const sudahSesuai = 'Sudah Sesuai'

                const tidakSetuju = i.dospem_tasis_mhs.some((o: any) => o.status_persetujuan === "tidak setuju")
                const belumReview = i.dospem_tasis_mhs.some((o: any) => o.status_persetujuan === "belum disetujui")

                const valPersetujuan = (tidakSetuju === true) ? belumSesuai : ((belumReview === true) ? belumDiReview : sudahSesuai);

                dataArr.push({
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    kemajuan: valPersetujuan,
                })
            })
        )

        let dataNew: any[] = []

        Promise.all(
            getBimbingan.map((i: any) => {
                let kemajuan = null
                let detailPenilaian = null
                dataArr.find((o: any) => {
                    if (o.id_trx_bimbingan === i.id_trx_bimbingan) {
                        kemajuan = o.kemajuan
                    }
                });
                getPersetujuanDosepemByNim.find((o: any) => {
                    if (o.id_trx_bimbingan === i.id_trx_bimbingan) {
                        detailPenilaian = o.dospem_tasis_mhs
                    }
                })
                dataNew.push({
                    id_materi_pembahasan: i.id_materi_pembahasan,
                    materi_pembahasan: i.materi_pembahasan,
                    id_sub_materi_pembahasan: i.id_sub_materi_pembahasan,
                    sub_materi_pembahasan: i.sub_materi_pembahasan,
                    status_sub_materi: i.status_sub_materi,
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    nim: i.nim,
                    url_path_doc: i.url_path_doc,
                    tgl_upload: i.tgl_upload,
                    tgl_terakhir_review: i.tgl_review,
                    kemajuan: kemajuan,
                    penilaian_kemajuan_detail: detailPenilaian
                })
            })
        )
        return dataNew;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updatePersetujuanBimbinganByNidn = async (
    nidn: string,
    idTrxBimbingan: number,
    statusPersetujuan: status_persetujuan_dospem_mhs
) => {
    try {
        const checkDataDospem: any = await BimbinganMhs.findOne({
            attributes: ["id_trx_bimbingan", "id_bimbingan", "id_dospem_mhs"],
            include: [
                {
                    model: RefDosepemMhs,
                    as: "dospem_tesis",
                    attributes: ["nim", "nidn", "keterangan_dospem"],
                    where: {
                        nidn: nidn
                    }
                }
            ],
            where: {
                id_trx_bimbingan: idTrxBimbingan
            }
        });
        if (!checkDataDospem) throw new CustomError(httpCode.notFound, "Dosen Tidak Terdaftar Sebagai Pembimbing Mahasiswa Ini")

        const idBimbingan = checkDataDospem.id_bimbingan

        const update = await BimbinganMhs.update({
            status_persetujuan: statusPersetujuan
        }, {
            where: {
                id_bimbingan: idBimbingan
            }
        });

        if (!update) throw new CustomError(httpCode.badRequest, "Gagal Menyetujui Bimbingan")

        const statusTesisMhs: any = await RefTesisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: checkDataDospem.dospem_tesis.nim
            }
        });

        if (statusTesisMhs.kode_status === "T04") {
            await statusMhsServiceWeb.updateStatusCapaianSeminarProposalMhs(checkDataDospem.dospem_tesis.nim)
        }
        if (statusTesisMhs.kode_status === "T07") {
            await statusMhsServiceWeb.updateStatusCapaianSeminarHasilMhs(checkDataDospem.dospem_tesis.nim)
        }
        await serviceNotif.createNotif(checkDataDospem.dospem_tesis.nim, `${checkDataDospem.dospem_tesis.keterangan_dospem} anda ${statusPersetujuan} dengan bimbingan kaliini`)

        return update;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updatePersetujuanSeminar = async (
    idTrxSeminar: string,
    idDospemMhs: string,
    statusPersetujuan: status_persetujuan_dospem_mhs
) => {
    try {
        const checkDataDospem: any = await SeminarMhs.findOne({
            attributes: ["id_trx_seminar", "id_seminar_mhs", "id_dospem_mhs"],
            include: [
                {
                    model: RefDosepemMhs,
                    as: "dospem_t",
                    attributes: ["nim", "nidn", "keterangan_dospem"],
                    where: {
                        id_dospem_mhs: idDospemMhs
                    }
                }
            ],
            where: {
                id_trx_seminar: idTrxSeminar
            }
        });
        if (!checkDataDospem) throw new CustomError(httpCode.notFound, "Dosen Tidak Terdaftar Sebagai Pembimbing Mahasiswa Ini")

        const idSeminar = checkDataDospem.id_seminar_mhs

        const update = await SeminarMhs.update({
            status_persetujuan: statusPersetujuan
        }, {
            where: {
                $id_seminar_mhs$: idSeminar
            }
        });

        if (!update) throw new CustomError(httpCode.badRequest, "Gagal Menyetujui")

        const statusTesisMhs: any = await RefTesisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: checkDataDospem.dospem_t.nim
            }
        });

        if (statusTesisMhs.kode_status === "T11" || statusTesisMhs.kode_status === "T10") {
            await statusMhsServiceWeb.updateStatusCapaianSeminarSidangAkhirMhs(idTrxSeminar)
        }

        await serviceNotif.createNotif(checkDataDospem.dospem_t.nim, `${checkDataDospem.dospem_t.keterangan_dospem} anda ${statusPersetujuan}`)

        return update;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataSeminarByNimAndKeteranganSeminar = async (
    nim: string,
    keterangan_seminar: string
) => {
    try {
        const data = await TrxSeminarMhs.findOne({
            attributes: ["id_trx_seminar", "nim", "keterangan_seminar", "url_path_pdf", "url_path_materi_ppt", "tgl_upload", "tgl_review"],
            include: [
                {
                    model: SeminarMhs,
                    as: "dospem_tasis_mhs",
                    attributes: ["id_seminar_mhs", "id_dospem_mhs", "tgl_detail_review"],
                    include: [
                        {
                            model: RefDosepemMhs,
                            as: "dospem_t",
                            attributes: ["keterangan_dospem", "nidn"],
                            include: [
                                {
                                    model: RefDosepem,
                                    as: "dosen_mhs",
                                    attributes: ["nama_dospem"]
                                }
                            ],
                        }
                    ]
                }
            ],
            where: {
                nim: nim,
                keterangan_seminar: keterangan_seminar
            }
        });
        let validation = false
        if (data) validation = true

        const dataNew = {
            validation: validation,
            data_seminar: data
        }
        return dataNew;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getDataHistoryBimbinganByNim = async (
    nim: string,
    id_sub_materi_pembahasan: string
) => {
    try {
        const getBimbingan = await db.query(`SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            a.id_sub_materi_pembahasan, a.sub_materi_pembahasan, a.status_sub_materi,
            b.id_trx_bimbingan, b.nim, b.url_path_doc, b.tgl_upload, b.tgl_review
            FROM (SELECT a.id_materi_pembahasan, a.materi_pembahasan,
            b.id_sub_materi_pembahasan, b.sub_materi_pembahasan, b.status_sub_materi
            FROM ref_materi_pembahasan a
            JOIN ref_sub_materi_pembahasan b
            ON a.id_materi_pembahasan = b.id_materi_pembahasan) a
            JOIN (SELECT id_trx_bimbingan, nim, id_sub_materi_pembahasan,
            url_path_doc, tgl_upload, tgl_review
            FROM trx_bimbingan_mhs 
            WHERE nim = :nim
            AND id_sub_materi_pembahasan = :id_sub_materi
            AND NOT id_trx_bimbingan = (SELECT MAX(id_trx_bimbingan) 
            FROM trx_bimbingan_mhs 
            WHERE nim = :nim
            AND id_sub_materi_pembahasan = :id_sub_materi
            GROUP BY id_sub_materi_pembahasan )) b
            ON a.id_sub_materi_pembahasan = b.id_sub_materi_pembahasan`,
            {
                replacements: { nim: nim, id_sub_materi: id_sub_materi_pembahasan },
                type: QueryTypes.SELECT
            }
        );

        if (getBimbingan.length === 0) throw new CustomError(httpCode.notFound, "histori bimbingan tidak ditemukan")

        const getPersetujuanDosepemByNim = await TrxBimbinganMhs.findAll({
            attributes: ['id_trx_bimbingan'],
            include: [
                {
                    model: BimbinganMhs,
                    as: "dospem_tasis_mhs",
                    attributes: ['id_bimbingan', 'status_persetujuan'],
                    include: [
                        {
                            model: RefDosepemMhs,
                            as: "dospem_tesis",
                            attributes: ["keterangan_dospem", "id_dospem_mhs"]
                        }
                    ]
                }
            ],
            where: {
                nim: nim,
                id_sub_materi_pembahasan: id_sub_materi_pembahasan,
                id_trx_bimbingan: {
                    [Op.notIn]: db.literal(`
                      (SELECT MAX(id_trx_bimbingan) FROM trx_bimbingan_mhs 
                      WHERE nim = '${nim}' 
                      AND id_sub_materi_pembahasan = '${id_sub_materi_pembahasan}'
                      GROUP BY id_sub_materi_pembahasan)
                    `)
                }
            }
        });

        let dataArr: any[] = []

        Promise.all(
            getPersetujuanDosepemByNim.map((i: any) => {
                const belumSesuai = 'Belum Sesuai'
                const belumDiReview = 'Belum direview'
                const sudahSesuai = 'Sudah Sesuai'

                const tidakSetuju = i.dospem_tasis_mhs.some((o: any) => o.status_persetujuan === "tidak setuju")
                const belumReview = i.dospem_tasis_mhs.some((o: any) => o.status_persetujuan === "belum disetujui")

                const valPersetujuan = (tidakSetuju === true) ? belumSesuai : ((belumReview === true) ? belumDiReview : sudahSesuai);

                dataArr.push({
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    kemajuan: valPersetujuan,
                })
            })
        )

        let dataNew: any[] = []

        Promise.all(
            getBimbingan.map((i: any) => {
                let kemajuan = null
                let detailPenilaian = null
                dataArr.find((o: any) => {
                    if (o.id_trx_bimbingan === i.id_trx_bimbingan) {
                        kemajuan = o.kemajuan
                    }
                })
                getPersetujuanDosepemByNim.find((o: any) => {
                    if (o.id_trx_bimbingan === i.id_trx_bimbingan) {
                        detailPenilaian = o.dospem_tasis_mhs
                    }
                })
                dataNew.push({
                    id_materi_pembahasan: i.id_materi_pembahasan,
                    materi_pembahasan: i.materi_pembahasan,
                    id_sub_materi_pembahasan: i.id_sub_materi_pembahasan,
                    sub_materi_pembahasan: i.sub_materi_pembahasan,
                    status_sub_materi: i.status_sub_materi,
                    id_trx_bimbingan: i.id_trx_bimbingan,
                    nim: i.nim,
                    url_path_doc: i.url_path_doc,
                    tgl_upload: i.tgl_upload,
                    tgl_terakhir_review: i.tgl_review,
                    kemajuan: kemajuan,
                    penilaian_kemajuan_detail: detailPenilaian
                })
            })
        )
        return dataNew;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeTrxBimbinganByNim = async (
    nim: string,
    id_sub_materi_pembahasan: number,
    url_path_doc: string,
    tgl_upload: string
): Promise<TrxBimbinganMhsInput> => {
    // const t = await db.transaction();
    try {
        const cekPayloadTgl = cekTgl(tgl_upload)

        if (cekPayloadTgl === false) throw new CustomError(httpCode.badRequest, "Pastikan format tgl_upload YYYY-MM-DD HH:MM:SS")
        const checkDospem = await RefDosepemMhs.findAll({
            attributes: ["id_dospem_mhs", "nidn", "status_persetujuan"],
            where: {
                nim: nim,
                status_persetujuan: "setuju"
            }
        });

        if (checkDospem.length < 2) throw new CustomError(httpCode.badRequest, "Dosen pembimbing belum ditetapkan atau belum diterima")

        if (checkDospem.length > 2) throw new CustomError(httpCode.badRequest, "Ada kesalahan sistem saat penetapan dospem")

        const validationBimbingan = await db.query(`SELECT a.id_trx_bimbingan, b.id_dospem_mhs, b.status_persetujuan
        FROM trx_bimbingan_mhs a
        JOIN ref_bimbingan_mhs b
        ON a.id_trx_bimbingan = b.id_trx_bimbingan
        WHERE a.nim = :nim
        AND a.id_sub_materi_pembahasan = :id_sub_materi_pembahasan
        AND a.id_trx_bimbingan = (
        SELECT MAX(id_trx_bimbingan)
        FROM trx_bimbingan_mhs 
        WHERE nim = :nim
        AND id_sub_materi_pembahasan = :id_sub_materi_pembahasan)`, {
            replacements: { nim: nim, id_sub_materi_pembahasan: id_sub_materi_pembahasan },
            type: QueryTypes.SELECT
        });

        const validationPersetujuan = validationBimbingan.some((i: any) => i.status_persetujuan === "belum disetujui")

        if (validationPersetujuan === true) throw new CustomError(httpCode.conflict, "Bimbingan belum di review dospem")

        const payloadTrx: TrxBimbinganMhsInput = {
            nim: nim,
            id_sub_materi_pembahasan: id_sub_materi_pembahasan,
            url_path_doc: url_path_doc,
            tgl_upload: tgl_upload
        }
        const storeTrx = await TrxBimbinganMhs.create(payloadTrx
            // , { transaction: t }
        )

        if (!storeTrx) throw new CustomError(httpCode.badRequest, "Gagal Upload Data[0]")

        const getIdMaxTrx = await TrxBimbinganMhs.findOne({
            attributes: [[fn('MAX', col('id_trx_bimbingan')), "id_trx_bimbingan"]],
            where: {
                nim: nim
            }
        })

        if (!getIdMaxTrx) throw new CustomError(httpCode.badRequest, "Gagal Upload Data[1]")

        const idDospemArrNol = checkDospem[0].id_dospem_mhs
        const idDospemArrSatu = checkDospem[1].id_dospem_mhs
        const payloadRef = [
            {
                id_dospem_mhs: idDospemArrNol,
                id_trx_bimbingan: getIdMaxTrx.get("id_trx_bimbingan"),
            },
            {
                id_dospem_mhs: idDospemArrSatu,
                id_trx_bimbingan: getIdMaxTrx.get("id_trx_bimbingan"),
            }
        ]

        const storeRefBimbingan = await BimbinganMhs.bulkCreate(payloadRef
            // , { transaction: t }
        )

        if (!storeRefBimbingan) throw new CustomError(httpCode.badRequest, "Gagal Upload Data[2]")

        // t.commit()
        return storeTrx
    } catch (error: any) {
        // t.rollback()
        removeFile(url_path_doc)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updateFileTrxBimbinganByNim = async (
    id_trx_bimbingan: number,
    url_path_doc: string
) => {
    try {
        const getFileNameEks = await TrxBimbinganMhs.findOne({
            attributes: ["url_path_doc"],
            where: {
                id_trx_bimbingan: id_trx_bimbingan
            }
        })

        if (!getFileNameEks) throw new CustomError(httpCode.notFound, "Data bimbingan tidak ditemukan")

        const fileNameEks = getFileNameEks.url_path_doc;

        const updateFileNew = await TrxBimbinganMhs.update({
            url_path_doc: url_path_doc
        }, {
            where: { id_trx_bimbingan: id_trx_bimbingan }
        })

        if (!updateFileNew) throw new CustomError(httpCode.badRequest, "Gagal update file")

        await removeFile(fileNameEks)

        return updateFileNew;
    } catch (error: any) {
        removeFile(url_path_doc)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeSeminarMhs = async (
    nim: string,
    keterangan_seminar: keterangan_seminar,
    url_path_pdf: string,
    url_path_materi_ppt: string,
    tgl_upload: string,
    files: any,
    kodeStatusMhs: string | null
) => {
    try {
        const cekPayloadTgl = cekTgl(tgl_upload)

        if (cekPayloadTgl === false) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Pastikan format tgl_upload YYYY-MM-DD HH:MM:SS")
        }

        const cekSeminar = await TrxSeminarMhs.findOne({
            attributes: ["nim"],
            where: {
                nim: nim,
                keterangan_seminar: keterangan_seminar
            }
        })

        if (cekSeminar) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Anda Sudah Upload")
        }

        const checkDospem = await RefDosepemMhs.findAll({
            attributes: ["id_dospem_mhs", "nidn", "status_persetujuan"],
            where: {
                nim: nim,
                status_persetujuan: "setuju"
            }
        });

        if (checkDospem.length < 2) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Dosen pembimbing belum ditetapkan atau belum diterima")
        }

        if (checkDospem.length > 2) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Ada kesalahan sistem saat penetapan dospem")
        }

        const payloadTrxSeminar: TrxSeminarMhsInput = {
            nim: nim,
            keterangan_seminar: keterangan_seminar,
            url_path_materi_ppt: url_path_materi_ppt,
            url_path_pdf: url_path_pdf,
            tgl_upload: tgl_upload
        }

        const storeTrxSeminar = await TrxSeminarMhs.create(payloadTrxSeminar)

        if (!storeTrxSeminar) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Gagal Upload[2]")
        }

        const getIdMaxTrx = await TrxSeminarMhs.findOne({
            attributes: [[fn('MAX', col('id_trx_seminar')), "id_trx_seminar"]],
            where: {
                nim: nim
            }
        })

        if (!getIdMaxTrx) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Gagal Upload Data[1]")
        }

        const idDospemArrNol = checkDospem[0].id_dospem_mhs
        const idDospemArrSatu = checkDospem[1].id_dospem_mhs
        const payloadRef = [
            {
                id_dospem_mhs: idDospemArrNol,
                id_trx_seminar: getIdMaxTrx.get("id_trx_seminar"),
            },
            {
                id_dospem_mhs: idDospemArrSatu,
                id_trx_seminar: getIdMaxTrx.get("id_trx_seminar"),
            }
        ]

        const storeRefSeminar = await SeminarMhs.bulkCreate(payloadRef)

        if (!storeRefSeminar) {
            files.forEach(async (items: any) => {
                await removeFile(items.filename)
            })
            throw new CustomError(httpCode.badRequest, "Gagal Upload[2]")
        }

        await RefTesisMhs.update({
            kode_status: (kodeStatusMhs === "T05") ? "T06" : "T09"
        }, {
            where: {
                nim: nim
            }
        })

        return storeTrxSeminar;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeSidangAkhir = async (
    nim: string,
    keterangan_seminar: keterangan_seminar,
    url_path_pdf: string,
    tgl_upload: string,
    files: any
) => {
    try {
        const cekPayloadTgl = cekTgl(tgl_upload)

        if (cekPayloadTgl === false) {
            await removeFile(files.filename)
            throw new CustomError(httpCode.badRequest, "Pastikan format tgl_upload YYYY-MM-DD HH:MM:SS")
        }

        const cekSeminar = await TrxSeminarMhs.findOne({
            attributes: ["id_trx_seminar", "nim", "url_path_pdf"],
            where: {
                nim: nim,
                keterangan_seminar: keterangan_seminar
            }
        })
        let storeTrxSeminar
        if (cekSeminar) {
            await removeFile(cekSeminar.url_path_pdf)
            storeTrxSeminar = TrxSeminarMhs.update({
                url_path_pdf: url_path_pdf
            }, {
                where: {
                    id_trx_seminar: cekSeminar.id_trx_seminar
                }
            })
        } else {
            const checkDospem = await RefDosepemMhs.findAll({
                attributes: ["id_dospem_mhs", "nidn", "status_persetujuan"],
                where: {
                    nim: nim,
                    status_persetujuan: "setuju"
                }
            });

            if (checkDospem.length < 2) {
                await removeFile(files.filename)
                throw new CustomError(httpCode.badRequest, "Dosen pembimbing belum ditetapkan atau belum diterima")
            }

            if (checkDospem.length > 2) {
                await removeFile(files.filename)
                throw new CustomError(httpCode.badRequest, "Ada kesalahan sistem saat penetapan dospem")
            }

            const payloadTrxSeminar: TrxSeminarMhsInput = {
                nim: nim,
                keterangan_seminar: keterangan_seminar,
                url_path_materi_ppt: '-',
                url_path_pdf: url_path_pdf,
                tgl_upload: tgl_upload
            }

            storeTrxSeminar = await TrxSeminarMhs.create(payloadTrxSeminar)

            if (!storeTrxSeminar) {
                await removeFile(files.filename)
                throw new CustomError(httpCode.badRequest, "Gagal Upload[2]")
            }

            const getIdMaxTrx = await TrxSeminarMhs.findOne({
                attributes: [[fn('MAX', col('id_trx_seminar')), "id_trx_seminar"]],
                where: {
                    nim: nim
                }
            })

            if (!getIdMaxTrx) {
                await removeFile(files.filename)
                throw new CustomError(httpCode.badRequest, "Gagal Upload Data[1]")
            }

            const idDospemArrNol = checkDospem[0].id_dospem_mhs
            const idDospemArrSatu = checkDospem[1].id_dospem_mhs
            const payloadRef = [
                {
                    id_dospem_mhs: idDospemArrNol,
                    id_trx_seminar: getIdMaxTrx.get("id_trx_seminar"),
                },
                {
                    id_dospem_mhs: idDospemArrSatu,
                    id_trx_seminar: getIdMaxTrx.get("id_trx_seminar"),
                }
            ]

            const storeRefSeminar = await SeminarMhs.bulkCreate(payloadRef)

            if (!storeRefSeminar) {
                await removeFile(files.filename)
                throw new CustomError(httpCode.badRequest, "Gagal Upload[2]")
            }

            await RefTesisMhs.update({
                kode_status: "T11"
            }, {
                where: {
                    nim: nim
                }
            })

        }

        return storeTrxSeminar;
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
    getDataBimbinganByNim,
    storeTrxBimbinganByNim,
    updateFileTrxBimbinganByNim,
    getDataHistoryBimbinganByNim,
    storeSeminarMhs,
    getDataSeminarByNimAndKeteranganSeminar,
    updatePersetujuanBimbinganByNidn,
    storeSidangAkhir,
    updatePersetujuanSeminar
}