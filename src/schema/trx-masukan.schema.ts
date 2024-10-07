import { TypeOf, number, object, string } from "zod";

const payloadTrxMasukan = {
    body: object({
        id_trx_bimbingan: number({
            required_error: "id_trx_bimbingan tidak boleh kosong",
            invalid_type_error: "id_trx_bimbingan harus bertipe huruf"
        }),
        id_dospem_mhs: number({
            required_error: "id_dospem_mhs tidak boleh kosong",
            invalid_type_error: "id_dospem_mhs harus bertipe nomor"
        }),
        masukan: string({
            required_error: "masukan tidak boleh kosong",
            invalid_type_error: "masukan harus bertipe huruf"
        }),
        tgl_review: string({
            required_error: "tgl_review tidak boleh kosong",
            invalid_type_error: "tgl_review harus bertipe huruf"
        })
    })
};

const payloadTrxMasukanSeminar = {
    body: object({
        id_trx_seminar: number({
            required_error: "id_trx_seminar tidak boleh kosong",
            invalid_type_error: "id_trx_seminar harus bertipe huruf"
        }),
        id_dospem_mhs: number({
            required_error: "id_dospem_mhs tidak boleh kosong",
            invalid_type_error: "id_dospem_mhs harus bertipe nomor"
        }),
        masukan: string({
            required_error: "masukan tidak boleh kosong",
            invalid_type_error: "masukan harus bertipe huruf"
        }),
        tgl_detail_review: string({
            required_error: "tgl_detail_review tidak boleh kosong",
            invalid_type_error: "tgl_detail_review harus bertipe huruf"
        })
    })
};

const paramsIdTrxMasukan = {
    params: object({
        id_trx_masukan: string({
            required_error: "id_trx_masukan tidak boleh kosong",
            invalid_type_error: "id_trx_masukan harus huruf",
        })
    })
}

export const payloadTrxMasukanSchema = object({
    ...payloadTrxMasukan
});

export const payloadTrxMasukanSeminarSchema = object({
    ...payloadTrxMasukanSeminar
});

export const paramsIdTrxMasukanSchema = object({
    ...paramsIdTrxMasukan
});

export type PayloadTrxMasukanRequest = TypeOf<typeof payloadTrxMasukanSchema>;
export type PayloadTrxMasukanSeminarRequest = TypeOf<typeof payloadTrxMasukanSeminarSchema>;
export type ParamsIdTrxMasukanRequest = TypeOf<typeof paramsIdTrxMasukanSchema>;