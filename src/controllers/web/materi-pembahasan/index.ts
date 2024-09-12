import {
    getAllMateriByNim,
    getByIdMateri,
    storeMateri,
    updateMateri,
    deleteMateri
} from "@controllers/web/materi-pembahasan/materi-pembahasan.controller";

import {
    getAllSubMateriByNim,
    getByIdSubMateri,
    storeSubMateri,
    updateSubMateri,
    deleteSubMateri
} from "@controllers/web/materi-pembahasan/sub-meteri-pembahasan.controller";

export default {
    getAllMateriByNim,
    getByIdMateri,
    storeMateri,
    updateMateri,
    deleteMateri,
    getAllSubMateriByNim,
    getByIdSubMateri,
    storeSubMateri,
    updateSubMateri,
    deleteSubMateri
}