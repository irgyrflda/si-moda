import { TypeOf, number, object, string } from "zod";

const payload = {
    body: object({
        nomor_induk: string({
            required_error: "nomor induk tidak boleh kosong",
            invalid_type_error: "nomor induk harus bertipe huruf"
        }),
        isi_notif: string({
            required_error: "isi notif tidak boleh kosong",
            invalid_type_error: "isi notif harus bertipe huruf"
        })
    })
};

const paramsNomorInduk = {
    params: object({
        nomor_induk: string({
            required_error: "nomor induk tidak boleh kosong",
            invalid_type_error: "nomor induk harus huruf",
        })
    })
}

const paramsId = {
    params: object({
        id_notif: number({
            required_error: "id notif tidak boleh kosong",
            invalid_type_error: "id notif harus angka",
        })
    })
}

export const payloadNotifSchema = object({
    ...payload
});

export const paramsNomorIndukNotifSchema = object({
    ...paramsNomorInduk
});

export const paramsIdNotifSchema = object({
    ...paramsId
});

export type PayloadNotifRequest = TypeOf<typeof payloadNotifSchema>;
export type ParamsNomorIndukNotifRequest = TypeOf<typeof paramsNomorIndukNotifSchema>;
export type ParamsIdNotifRequest = TypeOf<typeof paramsIdNotifSchema>;