import { TypeOf, object, string, nativeEnum } from "zod";
import { keterangan_dospem, status_persetujuan_dospem_mhs } from "@models/ref-dospem-mhs.models"

const payload = {
    body: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus bertipe huruf"
        }),
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus bertipe huruf"
        }),
        keterangan_dospem: nativeEnum(keterangan_dospem),
    })
};

const paramsId = {
    params: object({
        id_dospem_mhs: string({
            required_error: "id dospem mhs tidak boleh kosong",
            invalid_type_error: "id dospem mhs harus bertipe huruf"
        }),
    })
}

const paramsNim = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus bertipe huruf"
        }),
    })
}

export const payloadSchema = object({
    ...payload
});

export const paramsIdSchema = object({
    ...paramsId
});

export const paramsNimSchema = object({
    ...paramsNim
});

export type PayloadRequest = TypeOf<typeof payloadSchema>;
export type ParamsIdRequest = TypeOf<typeof paramsIdSchema>;
export type ParamsNimRequest = TypeOf<typeof paramsNimSchema>;