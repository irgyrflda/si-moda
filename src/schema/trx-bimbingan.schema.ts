import { status_persetujuan_dospem_mhs } from "@models/bimbingan-mhs.models";
import { keterangan_seminar } from "@models/trx-seminar-mhs.models";
import { TypeOf, nativeEnum, number, object, string } from "zod";

const payloadTrxBimbingan = {
    body: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus bertipe huruf"
        }),
        id_sub_materi_pembahasan: number({
            required_error: "id sub materi pembahasan tidak boleh kosong",
            invalid_type_error: "id sub materi pembahasan harus bertipe nomor"
        })
    })
};

const payloadPersetujuanBimbingan = {
    body: object({
        id_trx_bimbingan: number({
            required_error: "id_trx_bimbingan tidak boleh kosong",
            invalid_type_error: "id_trx_bimbingan harus bertipe angka"
        }),
        status_persetujuan: nativeEnum(status_persetujuan_dospem_mhs)
    })
};

const payloadPersetujuanSeminar = {
    body: object({
        status_persetujuan: nativeEnum(status_persetujuan_dospem_mhs)
    })
};

const paramsIdTrxBimbingan = {
    params: object({
        id_trx_bimbingan: string({
            required_error: "id trx bimbingan tidak boleh kosong",
            invalid_type_error: "id trx bimbingan harus huruf",
        })
    })
}

const paramsNim = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus angka",
        })
    })
}

const paramsNimAndIdSubMateri = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus angka",
        }),
        id_sub_materi_pembahasan: string({
            required_error: "id_sub_materi_pembahasan tidak boleh kosong",
            invalid_type_error: "id_sub_materi_pembahasan harus angka",
        })
    })
}

const paramsNimAndKeteranganSeminar = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus angka",
        }),
        keterangan_seminar: string({
            required_error: "keterangan_seminar tidak boleh kosong",
            invalid_type_error: "keterangan_seminar harus string",
        })
    })
}

const paramsIdTrxSeminarAndIdDospemMhs = {
    params: object({
        id_trx_seminar: string({
            required_error: "id_trx_seminar tidak boleh kosong",
            invalid_type_error: "id_trx_seminar harus angka",
        }),
        id_dospem_mhs: string({
            required_error: "id_dospem_mhs tidak boleh kosong",
            invalid_type_error: "id_dospem_mhs harus string",
        })
    })
}

export const payloadTrxBimbinganSchema = object({
    ...payloadTrxBimbingan
});

export const payloadPersetujuanBimbinganSchema = object({
    ...payloadPersetujuanBimbingan
});

export const payloadPersetujuanSeminarSchema = object({
    ...payloadPersetujuanSeminar
});

export const paramsIdTrxSeminarAndIdDospemMhsSchema = object({
    ...paramsIdTrxSeminarAndIdDospemMhs
});

export const paramsIdTrxBimbinganNotifSchema = object({
    ...paramsIdTrxBimbingan
});

export const paramsNimAndKeteranganSeminarSchema = object({
    ...paramsNimAndKeteranganSeminar
});

export const paramsNimTrxBimbinganSchema = object({
    ...paramsNim
});

export const paramsNimAndIdSubMateriTrxBimbinganSchema = object({
    ...paramsNimAndIdSubMateri
});

export type PayloadPersetujuanBimbinganRequest = TypeOf<typeof payloadPersetujuanBimbinganSchema>;
export type PayloadTrxBimbinganRequest = TypeOf<typeof payloadTrxBimbinganSchema>;
export type PayloadTrxSeminarRequest = TypeOf<typeof payloadPersetujuanSeminarSchema>;
export type ParamsIdTrxBimbinganRequest = TypeOf<typeof paramsIdTrxBimbinganNotifSchema>;
export type ParamsNimAndKeteranganSeminarRequest = TypeOf<typeof paramsNimAndKeteranganSeminarSchema>;
export type ParamsIdTrxSeminarAndIdDospemMhsRequest = TypeOf<typeof paramsIdTrxSeminarAndIdDospemMhsSchema>;
export type ParamsNimTrxBimbinganRequest = TypeOf<typeof paramsNimTrxBimbinganSchema>;
export type ParamsNimAndIdSubMateriTrxBimbinganRequest = TypeOf<typeof paramsNimAndIdSubMateriTrxBimbinganSchema>;