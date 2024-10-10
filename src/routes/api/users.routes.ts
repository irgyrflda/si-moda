import usersController from "@controllers/web/users";
import express from "express";
import validate from "@schema/validate";
import {
    payloadUsersSchema
} from "@schema/users.schema"
import { checkTokenSementara } from "@middleware/authorization";
const routes = express.Router();

routes.post("/first-login", validate(payloadUsersSchema), usersController.createUser);

export default routes;