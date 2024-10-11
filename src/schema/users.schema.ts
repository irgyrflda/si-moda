import { TypeOf, date, object, string, preprocess, number, array } from "zod";

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

const uploadJsonDsn = object({
    nomor_induk_dosen_nasional: string({
        required_error: "nomor_induk_mahasiswa tidak boleh kosong",
        invalid_type_error: "nomor_induk_mahasiswa harus bertipe huruf"
    }),
    nama: string({
        required_error: "nama tidak boleh kosong",
        invalid_type_error: "nama harus bertipe huruf"
    }),
    status: string({
        required_error: "status tidak boleh kosong",
        invalid_type_error: "status harus bertipe huruf"
    }),
    departemen: string({
        required_error: "departemen tidak boleh kosong",
        invalid_type_error: "departemen harus bertipe huruf"
    }),
    jabatan: string({
        required_error: "jabatan tidak boleh kosong",
        invalid_type_error: "jabatan harus bertipe huruf"
    }),
    tahun_masuk: number({
        required_error: "tahun_masuk tidak boleh kosong",
        invalid_type_error: "tahun_masuk harus bertipe angka"
    }),
    pendidikan_terakhir: string({
        required_error: "pendidikan_terakhir tidak boleh kosong",
        invalid_type_error: "pendidikan_terakhir harus bertipe huruf"
    })
});

const payloadUploadJsonDsn = {
    body: array(uploadJsonDsn).min(1, "Minimal harus ada satu dosen"),
};

const uploadJsonMhs = object({
    nomor_induk_mahasiswa: string({
        required_error: "nomor_induk_mahasiswa tidak boleh kosong",
        invalid_type_error: "nomor_induk_mahasiswa harus bertipe huruf"
    }),
    nama: string({
        required_error: "nama tidak boleh kosong",
        invalid_type_error: "nama harus bertipe huruf"
    }),
    status: string({
        required_error: "status tidak boleh kosong",
        invalid_type_error: "status harus bertipe huruf"
    }),
    jurusan: string({
        required_error: "jurusan tidak boleh kosong",
        invalid_type_error: "jurusan harus bertipe huruf"
    }),
    angkatan: number({
        required_error: "angkatan tidak boleh kosong",
        invalid_type_error: "angkatan harus bertipe angka"
    }),
    semester: number({
        required_error: "semester tidak boleh kosong",
        invalid_type_error: "semester harus bertipe angka"
    }),
    ipk: number({
        required_error: "ipk tidak boleh kosong",
        invalid_type_error: "ipk harus bertipe angka"
    }),
    ips_per_semester: object({
        semester_1: number({
            required_error: "semester_1 tidak boleh kosong",
            invalid_type_error: "semester_1 harus bertipe angka"
        }),
        semester_2: number({
            required_error: "semester_2 tidak boleh kosong",
            invalid_type_error: "semester_2 harus bertipe angka"
        }),
        semester_3: number({
            required_error: "semester_3 tidak boleh kosong",
            invalid_type_error: "semester_3 harus bertipe angka"
        }),
        semester_4: number({
            required_error: "semester_4 tidak boleh kosong",
            invalid_type_error: "semester_4 harus bertipe angka"
        }),
        semester_5: number({
            required_error: "semester_5 tidak boleh kosong",
            invalid_type_error: "semester_5 harus bertipe angka"
        }),
        semester_6: number({
            required_error: "semester_6 5idak boleh kosong",
            invalid_type_error: "semester_6 harus bertipe angka"
        }),
        semester_7: number({
            required_error: "semester_7 tidak boleh kosong",
            invalid_type_error: "semester_7 harus bertipe angka"
        }),
        semester_8: number({
            required_error: "semester_8 tidak boleh kosong",
            invalid_type_error: "semester_8 harus bertipe angka"
        })
    })
});

const payloadUploadJsonMhs = {
    body: array(uploadJsonMhs).min(1, "Minimal harus ada satu mahasiswa")
}

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

export const payloadUploadJsonMhsSchema = object({
    ...payloadUploadJsonMhs
});

export const payloadUploadJsonDsnSchema = object({
    ...payloadUploadJsonDsn
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
export type PayloadUploadJsonMhsRequest = TypeOf<typeof payloadUploadJsonMhsSchema>;
export type PayloadUploadJsonDsnRequest = TypeOf<typeof payloadUploadJsonDsnSchema>;
export type PayloadUsersRequest = TypeOf<typeof payloadUsersSchema>;
export type ParamsNimUsersRequest = TypeOf<typeof paramsNimUsersSchema>;
export type PayloadRefreshTokenRequest = TypeOf<typeof payloadRefreshTokenSchema>;