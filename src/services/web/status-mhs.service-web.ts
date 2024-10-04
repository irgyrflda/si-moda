import CustomError from "@middleware/error-handler"
import Status from "@models/ref-status.models"
import RefTesisMhs from "@models/ref-tesis-mhs.models"
import { httpCode } from "@utils/prefix"

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

export default {
    updateStatusTesisMhs
}