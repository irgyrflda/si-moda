import express from "express";
const routes = express.Router();
import user from "./users.routes";
import mahasiwa from "./mahasiswa.routes";
import agenda from "./agenda.routes";
import daftraPertemuan from "./daftar-pertemuan.routes";
import notifikasi from "./notifikasi.routes";
import dospem from "./dospem.routes";
import materiPembahasan from "./materi-pembahasan.routes";
import masukanDospem from "./masukan.routes";
import profiles from "./profiles.routes";

routes.use("/profiles", profiles)
routes.use("/masukan", masukanDospem)
routes.use("/users", user)
routes.use("/tesis-mhs", mahasiwa)
routes.use("/agenda", agenda)
routes.use("/daftar-pertemuan", daftraPertemuan)
routes.use("/notifikasi", notifikasi)
routes.use("/dosen-pembimbing", dospem)
routes.use("/materi", materiPembahasan)

export default routes;