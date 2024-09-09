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
const routes = express.Router();

routes.get("/data/:nim", checkToken, mahasiswaController.getTesisByNim);
routes.get("/capaian-tesis/:nim", checkToken, mahasiswaController.getCapaianMahasiswaByNim);
routes.post("/data", checkToken, validate(payloadArrayTesisMhsSchema), mahasiswaController.pengajuanJudulAndDospem);
routes.put("/data/:nim", checkToken, validate(updateJudulTesisSchema), mahasiswaController.updateJudulTesis);

export default routes;