import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import RefDosepemMhs, { RefDospemMhsInput, RefDospemMhsOutput, status_persetujuan_dospem_mhs, keterangan_dospem } from "@models/ref-dospem-mhs.models";
import { PayloadRequest } from "@schema/ref-dospem-mhs.schema";
import RefDosepem from "@models/ref-dospem.models";
import RefTesisMhs from "@models/ref-tesis-mhs.models";
import { Op, QueryTypes } from "sequelize";
import db from "@config/database";
import serviceNotif from "@services/web/trx-notifikasi.service-web";

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
            },
            include: [
                {
                    model: RefDosepem,
                    as: "dosen_mhs",
                    attributes: ["nama_dospem"]
                }
            ],
            raw: true
        })

        if (getData.length === 0) throw new CustomError(httpCode.notFound, "Mahasiswa bimbingan belum mendapatkan dosen pembimbing")

        const cekPersetujuanDospem = getData.some((i: any) => i.status_persetujuan === status_persetujuan_dospem_mhs.belum)

        if (cekPersetujuanDospem === true) throw new CustomError(httpCode.found, "Ada dospem yang belum disetujui")

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

const getByNidnDataDospemMhs = async (
    nidn: string,
    keterangan_dospem: string
) => {
    try {
        const getData = await db.query(`SELECT c.id_dospem_mhs, a.nim, b.nama_user nama_mahasiswa, 
        a.judul_tesis, c.status_persetujuan
        FROM ref_tesis_mahasiswa a
        JOIN ref_user b
        ON a.nim = b.nomor_induk
        JOIN ref_dospem_mhs c
        ON a.nim = c.nim
        WHERE c.nidn = :nidn
        AND c.keterangan_dospem = :keterangan_dospem
        ORDER BY 
        CASE 
        WHEN c.status_persetujuan = 'belum disetujui' THEN 0
        WHEN c.status_persetujuan = 'setuju' THEN 1
        ELSE 2
        END`, {
            replacements: { nidn: nidn, keterangan_dospem: keterangan_dospem },
            type: QueryTypes.SELECT
        })

        if (getData.length === 0) throw new CustomError(httpCode.notFound, "Mahasiswa bimbingan tidak ditemukan")

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

const updatePersetujuanDospem = async (
    id_dospem_mhs: string,
    status_persetujuan: status_persetujuan_dospem_mhs
) => {
    try {
        const checkDataMhsBimbingan = await RefDosepemMhs.findOne({
            attributes: ["nim", "keterangan_dospem"],
            where: {
                id_dospem_mhs: id_dospem_mhs
            },
            include: [
                {
                    model: RefDosepem,
                    as: "dosen_mhs",
                    attributes: ["nama_dospem"]
                }
            ]
        });

        if (!checkDataMhsBimbingan) throw new CustomError(httpCode.notFound, "Data tidak ditemukan")

        const namaDosem: any = checkDataMhsBimbingan.get("dosen_mhs")

        const updateStatusPersetujuan = await RefDosepemMhs.update({
            status_persetujuan: status_persetujuan
        }, {
            where: {
                id_dospem_mhs: id_dospem_mhs
            }
        })

        if (!updateStatusPersetujuan) throw new CustomError(httpCode.badRequest, "Gagal mengubah data")

        await serviceNotif.createNotif(checkDataMhsBimbingan.nim, `${namaDosem.nama_dospem} telah ${status_persetujuan} menjadi ${checkDataMhsBimbingan.keterangan_dospem} anda`)

        return updateStatusPersetujuan;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

interface persetujuanDospem {
    id_dospem_mhs: number
}

const updatePersetujuanDospemArray = async (
    arrayIdDospemMhs: persetujuanDospem[]
) => {
    try {
        let dataValidation: any[] = []
        await Promise.all(
            arrayIdDospemMhs.map(async (i: any) => {
                const data = await RefDosepemMhs.findOne({
                    attributes: ["nim", "keterangan_dospem"],
                    where: {
                        id_dospem_mhs: i.id_dospem_mhs
                    },
                    include: [
                        {
                            model: RefDosepem,
                            as: "dosen_mhs",
                            attributes: ["nama_dospem"]
                        }
                    ]
                })
                const namaDospem: any = data?.get("dosen_mhs")
                dataValidation.push({
                    nim: data?.nim,
                    nama_dospem: namaDospem?.nama_dospem,
                    keterangan_dospem: data?.keterangan_dospem
                })
            })
        )

        const cekDatavalidation: boolean = dataValidation.some((i: any) => i.nim === undefined)

        if (cekDatavalidation === true) throw new CustomError(httpCode.badRequest, "Ada mahasiswa yang tidak terdaftar")

        let updatePersetujuan: any[] = []
        await Promise.all(
            arrayIdDospemMhs.map(async (i: any) => {
                const update = await RefDosepemMhs.update({
                    status_persetujuan: i.status_persetujuan
                }, {
                    where: {
                        id_dospem_mhs: i.id_dospem_mhs
                    }
                })
                updatePersetujuan.push({
                    update: update
                })
            })
        )

        const cekUpdatePersetujuan: boolean = updatePersetujuan.some((i: any) => i.update[0] === 0)

        if (cekUpdatePersetujuan === true) throw new CustomError(httpCode.conflict, "Pastikan tidak ada mahasiswa yang sudah disetujui")


        let dataNotif: any[] = []

        await Promise.all(
            dataValidation.map((i: any) => {
                let statusPersetujuan: any
                arrayIdDospemMhs.find((o: any) => {
                    if (i.id_dospem_mhs === o.id_dospem_mhs) statusPersetujuan = o.status_persetujuan
                })
                dataNotif.push({
                    nim: i?.nim,
                    nama_dospem: i.nama_dospem,
                    keterangan_dospem: i?.keterangan_dospem,
                    status_persetujuan: statusPersetujuan
                })
            })
        )
        await Promise.all(
            dataNotif.map(async (i: any) => {
                await serviceNotif.createNotif(i.nim, `${i.nama_dospem} telah ${i.status_persetujuan} menjadi ${i.keterangan_dospem} anda`)
            })
        )
        return updatePersetujuan;
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
    getByNidnDataDospemMhs,
    updatePersetujuanDospem,
    updatePersetujuanDospemArray,
    storeDataDospemMhs
}