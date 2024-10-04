import express from "express";
import validate from "@schema/validate";
import mahasiswaController from "@controllers/web/mahasiswa"
import {
    payloadArrayTesisMhsSchema,
    updateJudulTesisSchema
} from "@schema/ref-tesis-mhs.schema";
import {
    checkToken
} from "@middleware/authorization";
import { uploadFile } from "@middleware/upload";
import { uploadFileSeminar } from "@middleware/upload-seminar";
const routes = express.Router();

//tesis mahasiswa
routes.get("/data/:nim", checkToken, mahasiswaController.getTesisByNim);
routes.put("/data/:nim", checkToken, validate(updateJudulTesisSchema), mahasiswaController.updateJudulTesis);
routes.post("/data", checkToken, validate(payloadArrayTesisMhsSchema), mahasiswaController.pengajuanJudulAndDospem);

//capaian mahasiswa
routes.get("/capaian-tesis/:nim", checkToken, mahasiswaController.getCapaianMahasiswaByNim);

//bimbingan mahasiswa
routes.get("/bimbingan-mhs/:nim", checkToken, mahasiswaController.getAllBimbinganByNim);
routes.get("/bimbingan-mhs-historis/:nim/:id_sub_materi_pembahasan", checkToken, mahasiswaController.getHistoryBimbinganByNimAndIdSubMateri);
routes.post("/bimbingan-mhs/upload", checkToken, uploadFile.single("file"), mahasiswaController.uploadPdf);
routes.post("/bimbingan-mhs/re-upload", checkToken, uploadFile.single("file"), mahasiswaController.uploadUlangPdf);
routes.get("/seminar/:nim/:keterangan_seminar", checkToken, mahasiswaController.getSeminarByNimAndKeteranganSeminar);

//upload seminar
routes.post("/upload-seminar", checkToken, uploadFileSeminar.array("file", 2), mahasiswaController.uploadPdfSeminar);

export default routes;