import express from "express";
import validate from "@schema/validate";
import masukanController from "@controllers/web/masukan";
import {
    checkToken
} from "@middleware/authorization";
import { payloadTrxMasukanSchema, payloadTrxMasukanSeminarSchema } from "@schema/trx-masukan.schema";
const routes = express.Router();

routes.get("/dospem/:id_trx_bimbingan", checkToken, masukanController.getAllMasukanByIdTrxbimbingan)
routes.get("/dospem/:id_trx_bimbingan/:nidn", checkToken, masukanController.getAllMasukanByIdTrxbimbinganAndNidn)
routes.get("/dospem-seminar/:id_trx_seminar/:id_dospem_mhs", checkToken, masukanController.getAllMasukanIdTrxSeminarAndIdDospemMhs);
routes.post("/dospem", checkToken, validate(payloadTrxMasukanSchema), masukanController.storeTrxMasukan)
routes.post("/dospem-seminar", checkToken, validate(payloadTrxMasukanSeminarSchema), masukanController.storeTrxMasukanSeminar)
routes.put("/dospem/:id_trx_masukan", checkToken, masukanController.updateMasukanByIdTrxMasukan)

export default routes;