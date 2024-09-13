import express from "express";
import validate from "@schema/validate";
import masukanController from "@controllers/web/masukan";
import {
    checkToken
} from "@middleware/authorization";
import { payloadTrxMasukanSchema } from "@schema/trx-masukan.schema";
const routes = express.Router();

routes.get("/dospem/:id_trx_bimbingan", checkToken, masukanController.getAllMasukanByIdTrxbimbingan)
routes.post("/dospem", checkToken, validate(payloadTrxMasukanSchema), masukanController.storeTrxMasukan)

export default routes;