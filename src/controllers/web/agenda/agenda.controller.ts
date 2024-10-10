import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import { QueryTypes } from "sequelize";
import RefTersisMhs from "@models/ref-tesis-mhs.models";
import db from "@config/database";
import {
    ParamsMhsNimAndTahunRequest,
    ParamsMhsNimAndBulanTahunRequest,
    ParamsMhsNimAndRangeTglBulanTahunRequest,
    ParamsDsnNidnAndTahunRequest,
    ParamsDsnNidnAndBulanTahunRequest,
    ParamsDsnNidnAndRangeTglBulanTahunRequest,
    ParamsIdRequest,
} from "@schema/trx-agenda.schema";
import RefDosepem from "@models/ref-dospem.models";
import TrxAgenda, { status_persetujuan_jadwal } from "@models/trx-agenda.models";
import serviceNotif from "@services/web/trx-notifikasi.service-web";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";

export const getAgendaMhsByNimAndTahun = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsMhsNimAndTahunRequest["params"]["nim"] = req.params.nim as string;
        const tahun: ParamsMhsNimAndTahunRequest["params"]["tahun"] = req.params.tahun as string;

        const getDataTesisMhs = await RefTersisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: nim
            }
        });

        if (!getDataTesisMhs) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tesis Tidak Ditemukan");

        const getAgendaMhs = await db.query(`SELECT a.nim, a.nidn, b.keterangan_dospem,
        a.kategori_agenda, a.keterangan_bimbingan, a.lokasi, a.status_persetujuan_jadwal,
        a.agenda_pertemuan, CAST(a.tgl_bimbingan AS CHAR) tgl_bimbingan
        FROM trx_agenda a
        LEFT JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        AND a.nidn = b.nidn
        WHERE a.nim = :nim
        AND YEAR(a.tgl_bimbingan) = :tahun`
            , {
                replacements: { nim: nim, tahun: tahun },
                type: QueryTypes.SELECT
            });

        if (getAgendaMhs.length === 0) throw new CustomError(httpCode.notFound, "Anda Belum Memiliki Agenda");

        const formattedData: any[] = [];
        Promise.all(
            getAgendaMhs.map((item: any) => {
                const tgl = new Date(item.tgl_bimbingan);
                const date = tgl.getDate();
                const jam = tgl.toTimeString().slice(0, 5).replace(":", ".");

                let existingDate = formattedData.find((f) => f.date === date);

                if (!existingDate) {
                    existingDate = { date, agenda: [] };
                    formattedData.push(existingDate);
                }

                existingDate.agenda.push({
                    jam,
                    lokasi: item.lokasi,
                    title: item.kategori_agenda.toString(),
                    agenda_pertemuan: item.agenda_pertemuan,
                    status_persetujuan_jadwal: item.status_persetujuan_jadwal
                });
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", formattedData)
    } catch (error) {
        errorLogger.error("Error get agenda : ", error)
        next(error);
    }
}

export const getAgendaMhsByNimAndBulanTahun = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsMhsNimAndBulanTahunRequest["params"]["nim"] = req.params.nim as string;
        const bulan: ParamsMhsNimAndBulanTahunRequest["params"]["bulan"] = req.params.bulan as string;
        const tahun: ParamsMhsNimAndBulanTahunRequest["params"]["tahun"] = req.params.tahun as string;

        const getDataTesisMhs = await RefTersisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: nim
            }
        });

        if (!getDataTesisMhs) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tesis Tidak Ditemukan");

        const getAgendaMhs = await db.query(`SELECT a.nim, a.nidn, b.keterangan_dospem,
        a.kategori_agenda, a.keterangan_bimbingan, a.lokasi, a.status_persetujuan_jadwal,
        a.agenda_pertemuan, CAST(a.tgl_bimbingan AS CHAR) tgl_bimbingan
        FROM trx_agenda a
        LEFT JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        AND a.nidn = b.nidn
        WHERE a.nim = :nim
        AND YEAR(a.tgl_bimbingan) = :tahun
        AND MONTH(a.tgl_bimbingan) = :bulan`
            , {
                replacements: { nim: nim, tahun: tahun, bulan: bulan },
                type: QueryTypes.SELECT
            });

        if (getAgendaMhs.length === 0) throw new CustomError(httpCode.notFound, "Anda Belum Memiliki Agenda");

        const formattedData: any[] = [];
        Promise.all(
            getAgendaMhs.map((item: any) => {
                const tgl = new Date(item.tgl_bimbingan);
                const date = tgl.getDate();
                const jam = tgl.toTimeString().slice(0, 5).replace(":", ".");

                let existingDate = formattedData.find((f) => f.date === date);

                if (!existingDate) {
                    existingDate = { date, agenda: [] };
                    formattedData.push(existingDate);
                }

                existingDate.agenda.push({
                    jam,
                    lokasi: item.lokasi,
                    title: item.kategori_agenda.toString(),
                    agenda_pertemuan: item.agenda_pertemuan,
                    status_persetujuan_jadwal: item.status_persetujuan_jadwal
                });
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", formattedData)
    } catch (error) {
        errorLogger.error("Error get agenda : ", error)
        next(error);
    }
}

export const getAgendaMhsByNimAndRangeTglBulanTahun = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nim: ParamsMhsNimAndRangeTglBulanTahunRequest["params"]["nim"] = req.params.nim as string;
        const tglMulai: ParamsMhsNimAndRangeTglBulanTahunRequest["params"]["tgl_awal"] = req.params.tgl_awal as string;
        const tglSelesai: ParamsMhsNimAndRangeTglBulanTahunRequest["params"]["tgl_akhir"] = req.params.tgl_akhir as string;
        const bulan: ParamsMhsNimAndRangeTglBulanTahunRequest["params"]["bulan"] = req.params.bulan as string;
        const tahun: ParamsMhsNimAndRangeTglBulanTahunRequest["params"]["tahun"] = req.params.tahun as string;

        const getDataTesisMhs = await RefTersisMhs.findOne({
            attributes: ["kode_status"],
            where: {
                nim: nim
            }
        });

        if (!getDataTesisMhs) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tesis Tidak Ditemukan");

        const getAgendaMhs = await db.query(`SELECT a.nim, a.nidn, b.keterangan_dospem,
        a.kategori_agenda, a.keterangan_bimbingan, a.lokasi, a.status_persetujuan_jadwal,
        a.agenda_pertemuan, CAST(a.tgl_bimbingan AS CHAR) tgl_bimbingan
        FROM trx_agenda a
        LEFT JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        AND a.nidn = b.nidn
        WHERE a.nim = :nim
        AND YEAR(a.tgl_bimbingan) = :tahun
        AND MONTH(a.tgl_bimbingan) = :bulan
        AND DAY(a.tgl_bimbingan) BETWEEN :tgl_mulai AND :tgl_selesai
        ORDER BY tgl_bimbingan`
            , {
                replacements: { nim: nim, tahun: tahun, bulan: bulan, tgl_mulai: tglMulai, tgl_selesai: tglSelesai },
                type: QueryTypes.SELECT
            });

        if (getAgendaMhs.length === 0) throw new CustomError(httpCode.notFound, "Anda Belum Memiliki Agenda");

        const formattedData: any[] = [];
        Promise.all(
            getAgendaMhs.map((item: any) => {
                const tgl = new Date(item.tgl_bimbingan);
                const date = tgl.getDate();
                const jam = tgl.toTimeString().slice(0, 5).replace(":", ".");

                let existingDate = formattedData.find((f) => f.date === date);

                if (!existingDate) {
                    existingDate = { date, agenda: [] };
                    formattedData.push(existingDate);
                }

                existingDate.agenda.push({
                    jam,
                    lokasi: item.lokasi,
                    title: item.kategori_agenda.toString(),
                    agenda_pertemuan: item.agenda_pertemuan,
                    status_persetujuan_jadwal: item.status_persetujuan_jadwal
                });
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", formattedData)
    } catch (error) {
        errorLogger.error("Error get agenda : ", error)
        next(error);
    }
}

export const getAgendaDsnByNidnAndTahun = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsDsnNidnAndTahunRequest["params"]["nidn"] = req.params.nidn as string;
        const tahun: ParamsDsnNidnAndTahunRequest["params"]["tahun"] = req.params.tahun as string;

        const getDataTesisDsn = await RefDosepem.findOne({
            attributes: ["nama_dospem"],
            where: {
                nidn: nidn
            }
        });

        if (!getDataTesisDsn) throw new CustomError(httpCode.notFound, "Data Dosepem pembimbing Tesis Tidak Ditemukan");

        const getAgendaDsn = await db.query(`SELECT a.nim, a.nidn, b.keterangan_dospem,
        a.kategori_agenda, a.keterangan_bimbingan, a.lokasi, a.status_persetujuan_jadwal,
        a.agenda_pertemuan, CAST(a.tgl_bimbingan AS CHAR) tgl_bimbingan
        FROM trx_agenda a
        LEFT JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        AND a.nidn = b.nidn
        WHERE a.nidn = :nidn
        AND YEAR(a.tgl_bimbingan) = :tahun`
            , {
                replacements: { nidn: nidn, tahun: tahun },
                type: QueryTypes.SELECT
            });

        if (getAgendaDsn.length === 0) throw new CustomError(httpCode.notFound, "Anda Belum Memiliki Agenda");

        const formattedData: any[] = [];
        Promise.all(
            getAgendaDsn.map((item: any) => {
                const tgl = new Date(item.tgl_bimbingan);
                const date = tgl.getDate();
                const jam = tgl.toTimeString().slice(0, 5).replace(":", ".");

                let existingDate = formattedData.find((f) => f.date === date);

                if (!existingDate) {
                    existingDate = { date, agenda: [] };
                    formattedData.push(existingDate);
                }

                existingDate.agenda.push({
                    jam,
                    lokasi: item.lokasi,
                    title: item.kategori_agenda.toString(),
                    agenda_pertemuan: item.agenda_pertemuan,
                    status_persetujuan_jadwal: item.status_persetujuan_jadwal
                });
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", formattedData)
    } catch (error) {
        errorLogger.error("Error get agenda : ", error)
        next(error);
    }
}

export const getAgendaDsnByNidnAndTahunBulan = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsDsnNidnAndBulanTahunRequest["params"]["nidn"] = req.params.nidn as string;
        const bulan: ParamsDsnNidnAndBulanTahunRequest["params"]["bulan"] = req.params.bulan as string;
        const tahun: ParamsDsnNidnAndBulanTahunRequest["params"]["tahun"] = req.params.tahun as string;

        const getDataTesisDsn = await RefDosepem.findOne({
            attributes: ["nama_dospem"],
            where: {
                nidn: nidn
            }
        });

        if (!getDataTesisDsn) throw new CustomError(httpCode.notFound, "Data Dosepem pembimbing Tesis Tidak Ditemukan");

        const getAgendaDsn = await db.query(`SELECT a.nim, a.nidn, b.keterangan_dospem,
        a.kategori_agenda, a.keterangan_bimbingan, a.lokasi, a.lokasi, a.status_persetujuan_jadwal,
        a.agenda_pertemuan, CAST(a.tgl_bimbingan AS CHAR) tgl_bimbingan
        FROM trx_agenda a
        LEFT JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        AND a.nidn = b.nidn
        WHERE a.nidn = :nidn
        AND YEAR(a.tgl_bimbingan) = :tahun
        AND MONTH(a.tgl_bimbingan) = :bulan`
            , {
                replacements: { nidn: nidn, tahun: tahun, bulan: bulan },
                type: QueryTypes.SELECT
            });

        if (getAgendaDsn.length === 0) throw new CustomError(httpCode.notFound, "Anda Belum Memiliki Agenda");

        const formattedData: any[] = [];
        Promise.all(
            getAgendaDsn.map((item: any) => {
                const tgl = new Date(item.tgl_bimbingan);
                const date = tgl.getDate();
                const jam = tgl.toTimeString().slice(0, 5).replace(":", ".");

                let existingDate = formattedData.find((f) => f.date === date);

                if (!existingDate) {
                    existingDate = { date, agenda: [] };
                    formattedData.push(existingDate);
                }

                existingDate.agenda.push({
                    jam,
                    lokasi: item.lokasi,
                    title: item.kategori_agenda.toString(),
                    agenda_pertemuan: item.agenda_pertemuan,
                    status_persetujuan_jadwal: item.status_persetujuan_jadwal
                });
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", formattedData)
    } catch (error) {
        errorLogger.error("Error get agenda : ", error)
        next(error);
    }
}

export const getAgendaDsnByNidnAndTahunBulanRangeTgl = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const nidn: ParamsDsnNidnAndRangeTglBulanTahunRequest["params"]["nidn"] = req.params.nidn as string;
        const tglMulai: ParamsDsnNidnAndRangeTglBulanTahunRequest["params"]["tgl_awal"] = req.params.tgl_awal as string;
        const tglSelesai: ParamsDsnNidnAndRangeTglBulanTahunRequest["params"]["tgl_akhir"] = req.params.tgl_akhir as string;
        const bulan: ParamsDsnNidnAndRangeTglBulanTahunRequest["params"]["bulan"] = req.params.bulan as string;
        const tahun: ParamsDsnNidnAndRangeTglBulanTahunRequest["params"]["tahun"] = req.params.tahun as string;

        const getDataTesisDsn = await RefDosepem.findOne({
            attributes: ["nama_dospem"],
            where: {
                nidn: nidn
            }
        });

        if (!getDataTesisDsn) throw new CustomError(httpCode.notFound, "Data Dosepem pembimbing Tesis Tidak Ditemukan");

        const getAgendaDsn = await db.query(`SELECT a.nim, a.nidn, b.keterangan_dospem,
        a.kategori_agenda, a.keterangan_bimbingan, a.lokasi, a.status_persetujuan_jadwal,
        a.agenda_pertemuan, CAST(a.tgl_bimbingan AS CHAR) tgl_bimbingan
        FROM trx_agenda a
        LEFT JOIN ref_dospem_mhs b
        ON a.nim = b.nim
        AND a.nidn = b.nidn
        WHERE a.nidn = :nidn
        AND YEAR(a.tgl_bimbingan) = :tahun
        AND MONTH(a.tgl_bimbingan) = :bulan
        AND DAY(a.tgl_bimbingan) BETWEEN :tgl_mulai AND :tgl_selesai
        ORDER BY tgl_bimbingan`
            , {
                replacements: { nidn: nidn, tahun: tahun, bulan: bulan, tgl_mulai: tglMulai, tgl_selesai: tglSelesai },
                type: QueryTypes.SELECT
            });

        if (getAgendaDsn.length === 0) throw new CustomError(httpCode.notFound, "Anda Belum Memiliki Agenda");

        const formattedData: any[] = [];
        Promise.all(
            getAgendaDsn.map((item: any) => {
                const tgl = new Date(item.tgl_bimbingan);
                const date = tgl.getDate();
                const jam = tgl.toTimeString().slice(0, 5).replace(":", ".");

                let existingDate = formattedData.find((f) => f.date === date);

                if (!existingDate) {
                    existingDate = { date, agenda: [] };
                    formattedData.push(existingDate);
                }

                existingDate.agenda.push({
                    jam,
                    lokasi: item.lokasi,
                    title: item.kategori_agenda.toString(),
                    agenda_pertemuan: item.agenda_pertemuan,
                    status_persetujuan_jadwal: item.status_persetujuan_jadwal
                });
            })
        )

        responseSuccess(res, httpCode.ok, "Berhasil memuat data", formattedData)
    } catch (error) {
        errorLogger.error("Error get agenda : ", error)
        next(error);
    }
}

export const storeAgendaPertemuanMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cekMhs = await RefTersisMhs.findOne({
            attributes: ["nim"],
            where: {
                nim: req.body.nim
            }
        })

        if (!cekMhs) throw new CustomError(httpCode.badRequest, "Mahasiswa Tidak Terdaftar")

        const dospem = req.body.dospem

        let dataNew: any[] = [];

        Promise.all(
            dospem.map((i: any) => {
                dataNew.push({
                    nim: req.body.nim,
                    agenda_pertemuan: req.body.agenda_pertemuan,
                    keterangan_bimbingan: req.body.keterangan_bimbingan,
                    lokasi: req.body.lokasi,
                    tgl_bimbingan: req.body.tgl_bimbingan,
                    nidn: i.nidn,
                    kategori_agenda: req.body.kategori_agenda,
                    uc: req.body.nim
                });

                serviceNotif.createNotif(i.nidn, "Anda memiliki agenda baru")
            })
        )

        const bulkCreate = await TrxAgenda.bulkCreate(dataNew);

        if (!bulkCreate) throw new CustomError(httpCode.badRequest, "Gagal Membuat Agenda");

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Agenda")
    } catch (error) {
        errorLogger.error("Error post agenda : ", error)
        next(error);
    }
}

export const storeAgendaPertemuanDsn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cekDsn = await RefDosepemMhs.findOne({
            attributes: ["nidn"],
            where: {
                nidn: req.body.nidn
            }
        })        

        if (!cekDsn) throw new CustomError(httpCode.badRequest, "Dosen Pembimbing Tidak Terdaftar")

        const mahasiswa = req.body.mahasiswa

        let dataNew: any[] = [];

        Promise.all(
            mahasiswa.map((i: any) => {
                dataNew.push({
                    nidn: req.body.nidn,
                    agenda_pertemuan: req.body.agenda_pertemuan,
                    keterangan_bimbingan: req.body.keterangan_bimbingan,
                    lokasi: req.body.lokasi,
                    tgl_bimbingan: req.body.tgl_bimbingan,
                    nim: i.nim,
                    kategori_agenda: req.body.kategori_agenda,
                    status_persetujuan_jadwal: status_persetujuan_jadwal.setuju,
                    uc: req.body.nidn
                });

                serviceNotif.createNotif(i.nim, "Anda memiliki agenda baru")
            })
        )
        console.log("agenda : ", req.body.tgl_bimbingan.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));

        const bulkCreate = await TrxAgenda.bulkCreate(dataNew);

        if (!bulkCreate) throw new CustomError(httpCode.badRequest, "Gagal Membuat Agenda");

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Agenda")
    } catch (error) {
        errorLogger.error("Error post agenda : ", error)
        next(error);
    }
}

export const updateAgendaPertemuanMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idTrxAgenda: ParamsIdRequest["params"]["id_trx_agenda"] = req.params.id_trx_agenda as string;
        const keterangan: string = req.body.keterangan

        const checkAgenda = await TrxAgenda.findOne({
            attributes: ["nim", "tgl_bimbingan", "status_persetujuan_jadwal"],
            where: {
                id_trx_agenda: idTrxAgenda
            }
        })

        if (!checkAgenda) throw new CustomError(httpCode.notFound, "Agenda Tidak Ditemukan")

        const nim: any = checkAgenda.nim
        let updateAgenda: any
        let message: string = 'Gagal Mengubah Agenda'

        if (keterangan === "Mahasiswa") {
            if (checkAgenda.status_persetujuan_jadwal === 'setuju') throw new CustomError(httpCode.badRequest, "Gagal mengubah tanggal agenda: Jadwal sudah disetujui oleh pembimbing")
            updateAgenda = await TrxAgenda.update({
                tgl_bimbingan: req.body.tgl_bimbingan,
                uu: nim
            }, {
                where: {
                    id_trx_agenda: idTrxAgenda
                }
            })
        } else if (keterangan === "Pembimbing") {
            updateAgenda = await TrxAgenda.update({
                tgl_bimbingan: req.body.tgl_bimbingan,
                status_persetujuan_jadwal: status_persetujuan_jadwal.setuju
            }, {
                where: {
                    id_trx_agenda: idTrxAgenda
                }
            })
            await serviceNotif.createNotif(nim, "Jadwal Bimbingan Telah Disetujui!!")
        } else {
            updateAgenda = null
            message = 'Pastikan keterangan berisi Mahasiswa atau Pembimbing'
        }

        if (!updateAgenda) throw new CustomError(httpCode.badRequest, message)
        responseSuccess(res, httpCode.ok, "Berhasil Mengubah Agenda")
    } catch (error) {
        errorLogger.error("Error post agenda : ", error)
        next(error);
    }
}

export const persetujaunAgendaPertemuanMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const idTrxAgenda: ParamsIdRequest["params"]["id_trx_agenda"] = req.params.id_trx_agenda as string;
        const checkAgenda = await TrxAgenda.findOne({
            attributes: ["nim", "status_persetujuan_jadwal"],
            where: {
                id_trx_agenda: idTrxAgenda
            }
        });

        if (!checkAgenda) throw new CustomError(httpCode.notFound, "Agenda Tidak Ditemukan")
        if (checkAgenda.status_persetujuan_jadwal === 'setuju') throw new CustomError(httpCode.conflict, "Agenda Sudah Disetujui")

        const nim: any = checkAgenda.nim
        const updateAgenda = await TrxAgenda.update({
            status_persetujuan_jadwal: status_persetujuan_jadwal.setuju
        }, {
            where: {
                id_trx_agenda: idTrxAgenda
            }
        });

        if (!updateAgenda) throw new CustomError(httpCode.badRequest, "Gagal Menyetujui Agenda Pertemuan")

        const dataAgendaNew = await TrxAgenda.findOne({
            attributes: ["id_trx_agenda", "status_persetujuan_jadwal"],
            where: {
                id_trx_agenda: idTrxAgenda
            }
        });

        await serviceNotif.createNotif(nim, "Jadwal Bimbingan Telah Disetujui!!")

        responseSuccess(res, httpCode.ok, "Berhasil Menyetujui", dataAgendaNew)
    } catch (error) {
        errorLogger.error("Error post agenda : ", error)
        next(error);
    }
}

export const createAgendaPertemuanDsn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

    } catch (error) {
        errorLogger.error("Error post agenda : ", error)
        next(error);
    }
}