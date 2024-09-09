import {
    getAgendaMhsByNimAndTahun,
    getAgendaMhsByNimAndBulanTahun,
    getAgendaMhsByNimAndRangeTglBulanTahun,
    getAgendaDsnByNidnAndTahun,
    getAgendaDsnByNidnAndTahunBulan,
    getAgendaDsnByNidnAndTahunBulanRangeTgl,
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
    getAllPertemuan
}