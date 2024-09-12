import express from "express";
import validate from "@schema/validate";
import agendaController from "@controllers/web/agenda"
import {
    payloadAgendaSchema
} from "@schema/trx-agenda.schema";
import {
    checkToken
} from "@middleware/authorization";
const routes = express.Router();

routes.get("/mhs/:nim/:tahun", checkToken, agendaController.getAgendaMhsByNimAndTahun);
routes.get("/mhs/:nim/:tahun/:bulan", checkToken, agendaController.getAgendaMhsByNimAndBulanTahun);
routes.get("/mhs/:nim/:tahun/:bulan/:tgl_awal/:tgl_akhir", checkToken, agendaController.getAgendaMhsByNimAndRangeTglBulanTahun);
routes.get("/dsn/:nidn/:tahun", checkToken, agendaController.getAgendaDsnByNidnAndTahun);
routes.get("/dsn/:nidn/:tahun/:bulan", checkToken, agendaController.getAgendaDsnByNidnAndTahunBulan);
routes.get("/dsn/:nidn/:tahun/:bulan/:tgl_awal/:tgl_akhir", checkToken, agendaController.getAgendaDsnByNidnAndTahunBulanRangeTgl);
routes.post("/", checkToken, validate(payloadAgendaSchema), agendaController.storeAgendaPertemuanMhs)

export default routes;