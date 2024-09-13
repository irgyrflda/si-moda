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

export const paramsIdTrxMasukanSchema = object({
    ...paramsIdTrxMasukan
});

export type PayloadTrxMasukanRequest = TypeOf<typeof payloadTrxMasukanSchema>;
export type ParamsIdTrxMasukanRequest = TypeOf<typeof paramsIdTrxMasukanSchema>;