import { TypeOf, object, string } from "zod";

const payload = {
    body: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus bertipe huruf"
        }),
        nama_dospem: string({
            required_error: "nama dospem tidak boleh kosong",
            invalid_type_error: "nama dospem harus bertipe huruf"
        })
    })
};

const paramsNidn = {
    params: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus bertipe huruf"
        }),
    })
}

export const payloadSchema = object({
    ...payload
});

export const paramsNidnSchema = object({
    ...paramsNidn
});

export type PayloadRequest = TypeOf<typeof payloadSchema>;
export type ParamsNidnRequest = TypeOf<typeof paramsNidnSchema>;