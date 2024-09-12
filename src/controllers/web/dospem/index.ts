import {
    getAllDataDospem,
    getByNidnDataDospem
} from "@controllers/web/dospem/ref-dospem.controller";

import {
    getByIdDataDospemMhs,
    getByNimDataDospemMhs,
    storeDataDospemMhs
} from "@controllers/web/dospem/ref-dospem-mhs.controller";

export default {
    getAllDataDospem,
    getByNidnDataDospem,
    getByIdDataDospemMhs,
    getByNimDataDospemMhs,
    storeDataDospemMhs
}