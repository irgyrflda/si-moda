import { TypeOf, number, object, string } from "zod";

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

export const payloadTrxBimbinganSchema = object({
    ...payloadTrxBimbingan
});

export const paramsIdTrxBimbinganNotifSchema = object({
    ...paramsIdTrxBimbingan
});

export const paramsNimTrxBimbinganSchema = object({
    ...paramsNim
});

export type PayloadTrxBimbinganRequest = TypeOf<typeof payloadTrxBimbinganSchema>;
export type ParamsIdTrxBimbinganRequest = TypeOf<typeof paramsIdTrxBimbinganNotifSchema>;
export type ParamsNimTrxBimbinganRequest = TypeOf<typeof paramsNimTrxBimbinganSchema>;