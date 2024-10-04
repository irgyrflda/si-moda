import express from "express";
import validate from "@schema/validate";
import dospemController from "@controllers/web/dospem";
import {
    checkToken
} from "@middleware/authorization";
import { payloadPersetujuanArraySchema, payloadPersetujuanSchema, payloadSchema } from "@schema/ref-dospem-mhs.schema";
import { payloadPersetujuanBimbinganSchema } from "@schema/trx-bimbingan.schema";
const routes = express.Router();

//route dosen
routes.get("/dosen", checkToken, dospemController.getAllDataDospem);
routes.get("/dosen/:nidn", checkToken, dospemController.getByNidnDataDospem);

//route dosen-mhs
routes.get("/dosen-mhs/single/:id_dospem_mhs", checkToken, dospemController.getByIdDataDospemMhs);
routes.get("/dosen-mhs/acc/:nim", checkToken, dospemController.getByNimDataDospemMhs);
routes.get("/daftar-mahasiswa/:nidn/:keterangan_dospem", checkToken, dospemController.getByNindDataDospemMhs);
routes.get("/daftar-mahasiswa-acc/:nidn/:keterangan_dospem", checkToken, dospemController.getByNindDataDospemMhsAcc);
routes.post("/dosen-mhs", checkToken, validate(payloadSchema), dospemController.storeDataDospemMhs);
routes.put("/persetujuan/:id_dospem_mhs", checkToken, validate(payloadPersetujuanSchema), dospemController.updatePersetujuanDospemMhs);
routes.post("/persetujuan", checkToken, validate(payloadPersetujuanArraySchema), dospemController.updatePersetujuanArrayDospemMhs);

//persetujuan bimbingan
routes.put("/persetujuan-dospem/:nidn", checkToken, validate(payloadPersetujuanBimbinganSchema), dospemController.updatePersetujuanBimbinganMhsDospemMhs);

//dashboard dospem
routes.get("/dashboard/:nidn", checkToken, dospemController.getDataDashboardDospem);

export default routes;