import CustomError from "@middleware/error-handler";
import { httpCode } from "./prefix";
import getAllServiceGroupUser from "@services/web/group-user.service-web";
import serviceSia from "@services/web/sia.service-web";

export const cekNoInduk = async (no_induk: string) => {
    try {
        const dataMhs = await serviceSia.getDataMhsByNimReturnBool(no_induk);
        const dataDsn = await serviceSia.getDataDsnByNidnReturnBool(no_induk);

        let dataNew = []
        const dataGroup = await getAllServiceGroupUser()
        const cekNoIndukMhs = dataMhs.dataMhsBool
        if (cekNoIndukMhs === false) {
            const cekNoIndukDsn = dataDsn.dataDsnBool
            if (cekNoIndukDsn === false) {
                throw new CustomError(httpCode.noContent, "User tidak terdaftar pada aplikasi admisi-sia.ut.ac.id")
            } else {
                const groupUser = dataGroup.filter(i => i.kode_group === "G02")
                const nomorInduk = dataDsn.dataDsn?.nomor_induk_dosen_nasional;
                const nama = dataDsn.dataDsn?.nama;
                const status = dataDsn.dataDsn?.status;
                dataNew.push({
                    kode_group: groupUser[0].kode_group,
                    nama_group: groupUser[0].nama_group,
                    nomor_induk: nomorInduk,
                    nama: nama,
                    status: status
                })
            }
        } else {
            const groupUser = dataGroup.filter(i => i.kode_group === "G01")
            const nomorInduk = dataMhs.dataMhs?.nomor_induk_mahasiswa;
            const nama = dataMhs.dataMhs?.nama;
            const status = dataMhs.dataMhs?.status;
            dataNew.push({
                kode_group: groupUser[0].kode_group,
                nama_group: groupUser[0].nama_group,
                nomor_induk: nomorInduk,
                nama: nama,
                status: status
            })
        }
        return dataNew[0];
    } catch (error) {
        throw new CustomError(httpCode.badRequest, `${error}`)
    }
}