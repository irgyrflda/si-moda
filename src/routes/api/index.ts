import express from "express";
const routes = express.Router();
import user from "./users.routes";
import mahasiwa from "./mahasiswa.routes";
import agenda from "./agenda.routes";
import daftraPertemuan from "./daftar-pertemuan.routes";
import notifikasi from "./notifikasi.routes";

routes.use("/users", user)
routes.use("/tesis-mhs", mahasiwa)
routes.use("/agenda", agenda)
routes.use("/daftar-pertemuan", daftraPertemuan)
routes.use("/notifikasi", notifikasi)

export default routes;