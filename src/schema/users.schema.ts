import { TypeOf, date, object, string, preprocess } from "zod";

const payload = {
    body: object({
        nomor_induk: string({
            required_error: "nomor induk tidak boleh kosong",
            invalid_type_error: "nomor induk harus bertipe huruf"
        }),
        password: string({
            required_error: "password tidak boleh kosong",
            invalid_type_error: "password harus bertipe huruf"
        })
        // token: string({
        //     required_error: "token tidak boleh kosong",
        //     invalid_type_error: "token harus bertipe huruf"
        // }),
        // refresh_token: string({
        //     required_error: "refresh_token tidak boleh kosong",
        //     invalid_type_error: "refresh_token harus bertipe huruf"
        // }),
        // token_expired: date({
        //     required_error: "token_expired tidak boleh kosong",
        //     invalid_type_error: "token_expired harus bertipe tanggal"
        // })
    })
};

const paramsNim = {
    params: object({
        nomor_induk: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus huruf",
        })
    })
}

const payloadLogin = {
    body: object({
        email: string({
            required_error: "email tidak boleh kosong",
            invalid_type_error: "email harus bertipe huruf"
        })
            .email("Email Tidak Valid"),
        password: string({
            required_error: "password tidak boleh kosong",
            invalid_type_error: "password harus bertipe huruf"
        })
        // token: string({
        //     required_error: "token tidak boleh kosong",
        //     invalid_type_error: "token harus bertipe huruf"
        // }),
        // refresh_token: string({
        //     required_error: "refresh_token tidak boleh kosong",
        //     invalid_type_error: "refresh_token harus bertipe huruf"
        // }),
        // token_expired: preprocess((arg) => {
        //     if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        // }, date({
        //     required_error: "token_expired tidak boleh kosong",
        //     invalid_type_error: "token_expired harus bertipe tanggal dengan format ISO 8601 (YYYY-MM-DDTHH:MM:SSZ) "
        // }))
    })
};

const payloadRefreshToken = {
    body: object({
        email: string({
            required_error: "email tidak boleh kosong",
            invalid_type_error: "email harus huruf",
        }),
        refresh_token: string({
            required_error: "refresh token tidak boleh kosong",
            invalid_type_error: "refresh token harus huruf",
        }),
    })
}

export const payloadUsersSchema = object({
    ...payload
});

export const paramsNimUsersSchema = object({
    ...paramsNim
});

export const payloadLoginSchema = object({
    ...payloadLogin
});

export const payloadRefreshTokenSchema = object({
    ...payloadRefreshToken
});

export type PayloadLoginRequest = TypeOf<typeof payloadLoginSchema>;
export type PayloadUsersRequest = TypeOf<typeof payloadUsersSchema>;
export type ParamsNimUsersRequest = TypeOf<typeof paramsNimUsersSchema>;
export type PayloadRefreshTokenRequest = TypeOf<typeof payloadRefreshTokenSchema>;