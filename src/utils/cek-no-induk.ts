import dataDummyMsh from "@public/data-dummy-mhs.json";
import dataDummyDsn from "@public/data-dummy-dsn.json";
import CustomError from "@middleware/error-handler";
import { httpCode } from "./prefix";
import getAllServiceGroupUser from "@services/web/group-user.service-web";

export const cekNoInduk = async (no_induk: string) => {
    try {
        const dataMhs = dataDummyMsh;
        const dataDsn = dataDummyDsn

        let dataNew = []
        const dataGroup = await getAllServiceGroupUser()
        const cekNoIndukMhs = dataMhs.filter(i => (i.nomor_induk_mahasiswa === no_induk))
        if (cekNoIndukMhs.length === 0) {
            const cekNoIndukDsn = dataDsn.filter(d => (d.nomor_induk_dosen_nasional === no_induk))
            if (cekNoIndukDsn.length === 0) {
                throw new CustomError(httpCode.noContent, "User tidak terdaftar pada aplikasi admisi-sia.ut.ac.id")
            } else {
                const groupUser = dataGroup.filter(i => i.kode_group === "G02")
                const dataUser = cekNoIndukDsn[0]
                dataNew.push({
                    kode_group: groupUser[0].kode_group,
                    nama_group: groupUser[0].nama_group,
                    nomor_induk: dataUser.nomor_induk_dosen_nasional,
                    nama: dataUser.nama,
                    status: dataUser.status
                })
            }
        } else {
            const groupUser = dataGroup.filter(i => i.kode_group === "G01")
            const dataUser = cekNoIndukMhs[0]
            dataNew.push({
                kode_group: groupUser[0].kode_group,
                nama_group: groupUser[0].nama_group,
                nomor_induk: dataUser.nomor_induk_mahasiswa,
                nama: dataUser.nama,
                status: dataUser.status
            })
        }
        return dataNew[0];
    } catch (error) {
        throw new CustomError(httpCode.badRequest, `${error}`)
    }
}