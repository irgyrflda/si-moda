import { TypeOf, number, object, string } from "zod";

const payloadRefMateri = {
    body: object({
        materi_pembahasan: string({
            required_error: "materi pembahasan tidak boleh kosong",
            invalid_type_error: "materi pembahasan harus bertipe huruf"
        })
    })
};

const paramsIdRefMateri = {
    params: object({
        id_materi_pembahasan: string({
            required_error: "id materi pembahasan tidak boleh kosong",
            invalid_type_error: "id materi pembahasan harus bertipe huruf"
        }),
    })
}

export const payloadRefMateriSchema = object({
    ...payloadRefMateri
});

export const paramsIdRefMateriSchema = object({
    ...paramsIdRefMateri
});

export type PayloadRefMateriRequest = TypeOf<typeof payloadRefMateriSchema>;
export type ParamsIdRefMateriRequest = TypeOf<typeof paramsIdRefMateriSchema>;