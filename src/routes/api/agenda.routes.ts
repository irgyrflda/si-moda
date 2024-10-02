import express from "express";
import validate from "@schema/validate";
import agendaController from "@controllers/web/agenda"
import {
    payloadAgendaDsnSchema,
    payloadAgendaMhsSchema,
    payloadUpdateAgendaSchema
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
routes.post("/", checkToken, validate(payloadAgendaMhsSchema), agendaController.storeAgendaPertemuanMhs);
routes.post("/dosen-pembimbing", checkToken, validate(payloadAgendaDsnSchema), agendaController.storeAgendaPertemuanDsn);
routes.put("/reschedule/:id_trx_agenda", checkToken, validate(payloadUpdateAgendaSchema), agendaController.updateAgendaPertemuanMhs);
routes.get("/persetujuan-agenda/:id_trx_agenda", checkToken, agendaController.persetujaunAgendaPertemuanMhs)

export default routes;