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
const routes = express.Router();

//tesis mahasiswa
routes.get("/data/:nim", checkToken, mahasiswaController.getTesisByNim);
routes.put("/data/:nim", checkToken, validate(updateJudulTesisSchema), mahasiswaController.updateJudulTesis);
routes.post("/data", checkToken, validate(payloadArrayTesisMhsSchema), mahasiswaController.pengajuanJudulAndDospem);

//capaian mahasiswa
routes.get("/capaian-tesis/:nim", checkToken, mahasiswaController.getCapaianMahasiswaByNim);

//bimbingan mahasiswa
routes.get("/bimbingan-mhs/:nim", checkToken, mahasiswaController.getAllBimbinganByNim);
routes.post("/bimbingan-mhs", checkToken, uploadFile.single("file"), mahasiswaController.uploadPdf);

export default routes;