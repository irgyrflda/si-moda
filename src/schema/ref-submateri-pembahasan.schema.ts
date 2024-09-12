import { status_sub_materi } from "@models/sub-materi-pembahasan.models";
import { TypeOf, nativeEnum, number, object, string } from "zod";

const payloadRefSubMateri = {
    body: object({
        id_materi_pembahasan: number({
            required_error: "id materi pembahasan tidak boleh kosong",
            invalid_type_error: "id materi pembahasan harus bertipe nomor"
        }),
        sub_materi_pembahasan: string({
            required_error: "sub materi pembahasan tidak boleh kosong",
            invalid_type_error: "sub materi pembahasan harus bertipe huruf"
        }),
        status_sub_materi: nativeEnum(status_sub_materi)
    })
};

const paramsIdRefSubMateri = {
    params: object({
        id_sub_materi_pembahasan: string({
            required_error: "id sub materi pembahasan tidak boleh kosong",
            invalid_type_error: "id sub materi pembahasan harus bertipe huruf"
        }),
    })
}

export const payloadRefSubMateriSchema = object({
    ...payloadRefSubMateri
});

export const paramsIdRefSubMateriSchema = object({
    ...paramsIdRefSubMateri
});

export type PayloadRefSubMateriRequest = TypeOf<typeof payloadRefSubMateriSchema>;
export type ParamsIdRefSubMateriRequest = TypeOf<typeof paramsIdRefSubMateriSchema>;