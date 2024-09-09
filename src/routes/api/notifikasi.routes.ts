import express from "express";
import notifController from "@controllers/web/notifikasi"
import {
    checkToken
} from "@middleware/authorization";
const routes = express.Router();

routes.get("/bar/:nomor_induk", checkToken, notifController.getAllNotifByNomorInduk);
routes.get("/bar-count/:nomor_induk", checkToken, notifController.getCountNotifByNomorInduk);
routes.put("/bar/:id_notif", checkToken, notifController.updateStatusNotifById);

export default routes;