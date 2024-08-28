import usersController from "@controllers/web/users";
import express from "express";
import validate from "@schema/validate";
import {
    payloadLoginSchema,
    PayloadUsersRequest
} from "@schema/users.schema"
const routes = express.Router();

routes.post("/login", validate(payloadLoginSchema), usersController.login);
routes.post("/first-login", usersController.createUser);

export default routes;