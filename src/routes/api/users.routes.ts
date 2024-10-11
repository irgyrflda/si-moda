import usersController from "@controllers/web/users";
import express from "express";
import validate from "@schema/validate";
import {
    payloadUploadJsonDsnSchema,
    payloadUploadJsonMhsSchema,
    payloadUsersSchema
} from "@schema/users.schema"
import { checkToken, checkTokenSementara } from "@middleware/authorization";
const routes = express.Router();

routes.post("/first-login", validate(payloadUsersSchema), usersController.createUser);
routes.post("/data-mhs", checkToken, validate(payloadUploadJsonMhsSchema), usersController.uploadDataMhs);
routes.post("/data-dsn", checkToken, validate(payloadUploadJsonDsnSchema), usersController.uploadDataDsn);

export default routes;