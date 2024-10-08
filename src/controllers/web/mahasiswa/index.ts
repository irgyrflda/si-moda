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
    uploadPdf,
    uploadUlangPdf,
    getHistoryBimbinganByNimAndIdSubMateri,
    uploadPdfSeminar,
    getSeminarByNimAndKeteranganSeminar,
    uploadPdfSidangAkhir
} from "@controllers/web/mahasiswa/bimbingan-mhs.controller";

import {
    generateDokumenKelayakan
} from "@controllers/web/mahasiswa/dokumen-kelayakan.controller";

export default {
    getTesisByNim,
    pengajuanJudulAndDospem,
    updateJudulTesis,
    getCapaianMahasiswaByNim,
    getAllBimbinganByNim,
    uploadPdf,
    uploadUlangPdf,
    getHistoryBimbinganByNimAndIdSubMateri,
    uploadPdfSeminar,
    getSeminarByNimAndKeteranganSeminar,
    generateDokumenKelayakan,
    uploadPdfSidangAkhir
}