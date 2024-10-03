import {
    getAllDataDospem,
    getByNidnDataDospem,
    getDataDashboardDospem
} from "@controllers/web/dospem/ref-dospem.controller";

import {
    getByIdDataDospemMhs,
    getByNimDataDospemMhs,
    getByNindDataDospemMhs,
    updatePersetujuanDospemMhs,
    updatePersetujuanArrayDospemMhs,
    storeDataDospemMhs,
    getByNindDataDospemMhsAcc
} from "@controllers/web/dospem/ref-dospem-mhs.controller";

export default {
    getAllDataDospem,
    getByNidnDataDospem,
    getByIdDataDospemMhs,
    getByNimDataDospemMhs,
    getByNindDataDospemMhs,
    updatePersetujuanDospemMhs,
    updatePersetujuanArrayDospemMhs,
    storeDataDospemMhs,
    getByNindDataDospemMhsAcc,
    getDataDashboardDospem
}