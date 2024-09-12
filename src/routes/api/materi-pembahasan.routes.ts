import express from "express";
import validate from "@schema/validate";
import materiPembahasanController from "@controllers/web/materi-pembahasan";
import {
    checkToken
} from "@middleware/authorization";
import { payloadRefMateriSchema } from "@schema/ref-materi-pembahasan.schema";
import { payloadRefSubMateriSchema } from "@schema/ref-submateri-pembahasan.schema";
const routes = express.Router();

routes.get("/pembahasan", checkToken, materiPembahasanController.getAllMateriByNim);
routes.get("/pembahasan/:id_materi_pembahasan", checkToken, materiPembahasanController.getByIdMateri);
routes.post("/pembahasan", checkToken, validate(payloadRefMateriSchema), materiPembahasanController.storeMateri);
routes.put("/pembahasan/:id_materi_pembahasan", checkToken, validate(payloadRefMateriSchema), materiPembahasanController.updateMateri);
routes.delete("/pembahasan/:id_materi_pembahasan", checkToken, materiPembahasanController.deleteMateri);
routes.get("/sub-pembahasan", checkToken, materiPembahasanController.getAllSubMateriByNim);
routes.get("/sub-pembahasan/:id_sub_materi_pembahasan", checkToken, materiPembahasanController.getByIdSubMateri);
routes.post("/sub-pembahasan", checkToken, validate(payloadRefSubMateriSchema), materiPembahasanController.storeSubMateri);
routes.put("/sub-pembahasan/:id_sub_materi_pembahasan", checkToken, validate(payloadRefSubMateriSchema), materiPembahasanController.updateSubMateri);
routes.delete("/sub-pembahasan/:id_sub_materi_pembahasan", checkToken, materiPembahasanController.deleteSubMateri);

export default routes;