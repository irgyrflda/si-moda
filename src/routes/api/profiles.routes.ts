import profileController from "@controllers/web/profile";
import express from "express";
import { checkToken } from "@middleware/authorization";
const routes = express.Router();

routes.get('/mhs/:nidn/:keterangan_dospem', checkToken, profileController.profileMhsByNidnAndKetDospem);
routes.get('/mhs/:nim', checkToken, profileController.profileMhsByNim);
routes.get('/dsn/:nidn', checkToken, profileController.profileDsnByNidn);

export default routes;