import db from "@config/database";
import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";
import RefDosepem from "@models/ref-dospem.models";
import Status from "@models/ref-status.models";
import RefTersisMhs, { RefTersisMhsInput, RefTersisMhsOutput } from "@models/ref-tesis-mhs.models";
import TrxNotifikasi from "@models/trx-notifikasi.models";
import TrxTopikUser from "@models/trx-topik-penelitian.models";
import Users from "@models/users.models";
import { ParamsTesisMhsNimRequest } from "@schema/ref-tesis-mhs.schema";
import { httpCode } from "@utils/prefix";
import { Op } from "sequelize";

const getAllTesisMhs = async (): Promise<RefTersisMhsOutput[]> => {
    try {
        const tesisMhs: RefTersisMhs[] = await RefTersisMhs.findAll()
        if (!tesisMhs || tesisMhs.length === 0) throw new CustomError(httpCode.found, "Data Tidak Ditemukan");
        return tesisMhs;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByNimTesisMhs = async (
    nim: ParamsTesisMhsNimRequest["params"]["nim"]
): Promise<RefTersisMhsOutput> => {
    try {
        const tesisMhs: RefTersisMhs | null = await RefTersisMhs.findOne({
            attributes: ["nim", "judul_tesis", "kode_status"],
            where: {
                nim: nim
            }
        })
        if (!tesisMhs) throw new CustomError(httpCode.notFound, "Data Mahasiswa Tesis Tidak Ditemukan");
        return tesisMhs;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByNimTesisMhsLengkap = async (
    nim: ParamsTesisMhsNimRequest["params"]["nim"]
): Promise<RefTersisMhsOutput> => {
    try {
        const tesisMhs: RefTersisMhs | null = await RefTersisMhs.findOne({
            attributes: ["nim", "judul_tesis"],
            where: {
                nim: nim
            },
            include: [
                {
                    model: Status,
                    as: "status",
                    attributes: ["kode_status", "keterangan_status"]
                },
                {
                    model: RefDosepemMhs,
                    as: "dospem_mhs_tesis",
                    attributes: ["keterangan_dospem", "status_persetujuan"],
                    where: {
                        [Op.or]: [
                            {
                                status_persetujuan: "setuju"
                            },
                            {
                                status_persetujuan: "belum disetujui"
                            }
                        ]
                    },
                    include: [
                        {
                            model: RefDosepem,
                            as: "dosen_mhs",
                            attributes: ["nidn", "nama_dospem"]
                        }
                    ],
                },
                {
                    model: TrxTopikUser,
                    as: "topik_mhs",
                    attributes: ["id_topik", "topik_penelitian"]
                }
            ]
        })
        if (!tesisMhs) throw new CustomError(httpCode.notFound, "Data Tidak Ditemukan");
        return tesisMhs;
    } catch (error: any) {
        console.log("error get data tesis by nim lengkap : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeTesisMhs = async (
    nim: string,
    judul_tesis: string,
    dospem: any,
    topik_tesis: any
): Promise<RefTersisMhsInput> => {
    const t = await db.transaction();
    try {
        const cekUser = await Users.findOne({
            where: {
                nomor_induk: nim
            }
        })

        if (!cekUser) throw new CustomError(httpCode.notFound, "Mahasiswa Tidak Terdaftar Pada Aplikasi")

        const payload: RefTersisMhsInput = {
            nim: nim,
            judul_tesis: judul_tesis
        }
        const storePayload = await RefTersisMhs.create(payload, { transaction: t })

        if (!storePayload) throw new CustomError(httpCode.badRequest, "Gagal membuat data[0]");

        let validasiDospem: any = []

        await Promise.all(
            dospem.map(async (i: any) => {
                const dataDospem = await RefDosepem.findOne({
                    attributes: ["nidn"],
                    where: {
                        nidn: i.nidn
                    }
                })
                validasiDospem.push({
                    validasi: (!dataDospem) ? 0 : 1
                })
            })
        )

        const cekValidasiDospem = await validasiDospem.some((i: any) => i.validasi < 1)

        if (cekValidasiDospem === true) throw new CustomError(httpCode.notFound, "Ada Dospem Yang Tidak Terdaftar")

        const nidnArray = await dospem.map((item: any) => item.nidn);
        const isDuplicate = new Set(nidnArray).size !== nidnArray.length;

        if (isDuplicate) throw new CustomError(httpCode.conflict, "Terdapat dospem yang sama")

        const payloadDospemMhs = await dospem.map((i: any) => {
            return {
                nim: nim,
                nidn: i.nidn,
                keterangan_dospem: i.keterangan_dospem,
                uc: nim
            }
        })

        const storeBulkDsnMhs = await RefDosepemMhs.bulkCreate(payloadDospemMhs, { transaction: t })

        if (!storeBulkDsnMhs) throw new CustomError(httpCode.badRequest, "Gagal Membuat Data[1]")

        const paloadTopik = await topik_tesis.map((i: any) => {
            return {
                nomor_induk: nim,
                topik_penelitian: i.topik_penelitian,
                uc: nim
            }
        })

        const storeBulkTopik = await TrxTopikUser.bulkCreate(paloadTopik, { transaction: t })

        if (!storeBulkTopik) throw new CustomError(httpCode.badRequest, "Gagal Membuat Data[2]")

        Promise.all(
            payloadDospemMhs.map((i: any) => {
                TrxNotifikasi.create({
                    nomor_induk: i.nidn,
                    isi_notif: `Anda Dipilih Mahasiswa Menjadi ${(i.keterangan_dospem === 'dospem 1') ? 'Dosen pembimbing utama' : 'Dosen pembimbing pendamping'}`
                })
            })
        )

        await t.commit();
        return storePayload;
    } catch (error) {
        console.log("error : ", error);
        await t.rollback();
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updateJudulTesis = async (
    nim: ParamsTesisMhsNimRequest["params"]["nim"],
    judul: string
) => {
    try {
        const tesisMhs: RefTersisMhs | null = await RefTersisMhs.findOne({
            where: {
                nim: nim
            }
        })
        if (!tesisMhs) throw new CustomError(httpCode.found, "Data Tidak Ditemukan");

        const JudulNew = judul
        const updateJudul = await RefTersisMhs.update({
            judul_tesis: JudulNew
        },
            {
                where: {
                    nim: nim
                }
            })

        if (!updateJudul) throw new CustomError(httpCode.badRequest, "Gagal Mengubah Data")
        return updateJudul;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const deleteByNimTesisMhs = async (
    nim: ParamsTesisMhsNimRequest["params"]["nim"]
) => {
    try {
        const tesisMhs: RefTersisMhs | null = await RefTersisMhs.findOne({
            where: {
                nim: nim
            }
        })
        if (!tesisMhs) throw new CustomError(httpCode.found, "Data Tidak Ditemukan");

        const destroyTesisMhs = await RefDosepemMhs.destroy({
            where: {
                nim: nim
            }
        })

        if (!destroyTesisMhs) throw new CustomError(httpCode.badRequest, "Gagal Menghapus Data")

        return destroyTesisMhs;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getAllTesisMhs,
    getByNimTesisMhs,
    storeTesisMhs,
    getByNimTesisMhsLengkap,
    updateJudulTesis,
    deleteByNimTesisMhs
};