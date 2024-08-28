import express from "express";
const routes = express.Router();
import user from "../api-public/users.routes"

routes.use("/users", user)

export default routes;