import { TypeOf, date, object, string, preprocess } from "zod";

const payload = {
    body: object({
        nomor_induk: string({
            required_error: "nomor induk tidak boleh kosong",
            invalid_type_error: "nomor induk harus bertipe huruf"
        }),
        kode_group: string({
            required_error: "kode group tidak boleh kosong",
            invalid_type_error: "kode group harus bertipe huruf"
        })
    })
};

const paramsNimKodeGroup = {
    params: object({
        nomor_induk: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus huruf",
        }),
        kode_group: string({
            required_error: "kode group tidak boleh kosong",
            invalid_type_error: "kode group harus huruf",
        })
    })
}

export const payloadRefGroupUsersSchema = object({
    ...payload
});

export const paramsNimKodeGroupRefGroupUsersSchema = object({
    ...paramsNimKodeGroup
});

export type PayloadRefGroupUsersRequest = TypeOf<typeof payloadRefGroupUsersSchema>;
export type ParamsNimKodeGroupRefGroupUsersRequest = TypeOf<typeof paramsNimKodeGroupRefGroupUsersSchema>;