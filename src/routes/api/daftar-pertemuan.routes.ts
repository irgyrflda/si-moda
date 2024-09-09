import express from "express";
import validate from "@schema/validate";
import daftraPertemuanController from "@controllers/web/agenda"
import {
    checkToken
} from "@middleware/authorization";
const routes = express.Router();

routes.get("/bimbingan/:nidn/:tahun", checkToken, daftraPertemuanController.getAllPertemuan);

export default routes;