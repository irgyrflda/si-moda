import usersController from "@controllers/web/users";
import express from "express";
import validate from "@schema/validate";
import {
    payloadLoginSchema,
} from "@schema/users.schema"
const routes = express.Router();

routes.post("/login", validate(payloadLoginSchema), usersController.login);

export default routes;