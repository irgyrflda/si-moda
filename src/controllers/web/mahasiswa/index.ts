import {
    getTesisByNim,
    pengajuanJudulAndDospem,
    updateJudulTesis
} from "@controllers/web/mahasiswa/pengajuan.controller";

import {
    getCapaianMahasiswaByNim
} from "@controllers/web/mahasiswa/capaian-mhs.controller";

import {
    getAllBimbinganByNim,
    uploadPdf
} from "@controllers/web/mahasiswa/bimbingan-mhs.controller";

export default {
    getTesisByNim,
    pengajuanJudulAndDospem,
    updateJudulTesis,
    getCapaianMahasiswaByNim,
    getAllBimbinganByNim,
    uploadPdf
}