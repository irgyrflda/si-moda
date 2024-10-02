import {
    getAgendaMhsByNimAndTahun,
    getAgendaMhsByNimAndBulanTahun,
    getAgendaMhsByNimAndRangeTglBulanTahun,
    getAgendaDsnByNidnAndTahun,
    getAgendaDsnByNidnAndTahunBulan,
    getAgendaDsnByNidnAndTahunBulanRangeTgl,
    storeAgendaPertemuanMhs,
    updateAgendaPertemuanMhs,
    persetujaunAgendaPertemuanMhs,
    storeAgendaPertemuanDsn
} from "@controllers/web/agenda/agenda.controller";

import {
    getAllPertemuan
} from "@controllers/web/agenda/daftar-pertemuan.controller"

export default {
    getAgendaMhsByNimAndTahun,
    getAgendaMhsByNimAndBulanTahun,
    getAgendaMhsByNimAndRangeTglBulanTahun,
    getAgendaDsnByNidnAndTahun,
    getAgendaDsnByNidnAndTahunBulan,
    getAgendaDsnByNidnAndTahunBulanRangeTgl,
    getAllPertemuan,
    storeAgendaPertemuanMhs,
    updateAgendaPertemuanMhs,
    persetujaunAgendaPertemuanMhs,
    storeAgendaPertemuanDsn
}