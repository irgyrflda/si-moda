import usersController from "@controllers/web/users";
import express from "express";
import validate from "@schema/validate";
import {
    payloadLoginSchema,
    payloadRefreshTokenSchema
} from "@schema/users.schema"
const routes = express.Router();

routes.post("/login", validate(payloadLoginSchema), usersController.login);
routes.post("/refresh-token", validate(payloadRefreshTokenSchema), usersController.refreshTokenUser)
routes.delete("/clear", usersController.deleteData);

export default routes;