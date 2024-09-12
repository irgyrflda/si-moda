import db from "@config/database";
import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import BimbinganMhs from "@models/bimbingan-mhs.models";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";
import TrxBimbinganMhs, { TrxBimbinganMhsInput } from "@models/trx-bimbingan-mhs.models";
import { httpCode } from "@utils/prefix";
import { removeFile } from "@utils/remove-file";
import { col, fn } from "sequelize";

const storeTrxBimbinganByNim = async (
    nim: string,
    id_sub_materi_pembahasan: number,
    url_path_doc: string
): Promise<TrxBimbinganMhsInput> => {
    // const t = await db.transaction();
    try {
        const checkDospem = await RefDosepemMhs.findAll({
            attributes: ["id_dospem_mhs", "nidn", "status_persetujuan"],
            where: {
                nim: nim,
                status_persetujuan: "setuju"
            }
        });

        if (checkDospem.length < 2) throw new CustomError(httpCode.badRequest, "Dosen pembimbing belum ditetapkan atau belum diterima")

        if (checkDospem.length > 2) throw new CustomError(httpCode.badRequest, "Ada kesalahan sistem saat penetapan dospem")

        const payloadTrx: TrxBimbinganMhsInput = {
            nim: nim,
            id_sub_materi_pembahasan: id_sub_materi_pembahasan,
            url_path_doc: url_path_doc
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
        const idDospemArrSatu = checkDospem[0].id_dospem_mhs
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

export default {
    storeTrxBimbinganByNim
}