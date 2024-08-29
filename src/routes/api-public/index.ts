import express from "express";
const routes = express.Router();
import user from "./users.routes"

routes.use("/users", user)

export default routes;