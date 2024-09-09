import { TypeOf, date, object, string, array } from "zod";

const payload = {
    body: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus bertipe huruf"
        }),
        judul_tesis: string({
            required_error: "judul tesis tidak boleh kosong",
            invalid_type_error: "judul tesis harus bertipe huruf"
        })
    })
};

const dospemSchema = object({
    nidn: string({
        required_error: "nidn tidak boleh kosong",
        invalid_type_error: "nidn harus bertipe huruf"
    }),
    keterangan_dospem: string().min(1, "Keterangan dospem tidak boleh kosong"),
});

const topikTesisSchema = object({
    topik_penelitian: string().min(1, "Topik penelitian tidak boleh kosong"),
});

const payloadArrayTesisMhs = {
    body: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus bertipe huruf"
        }),
        judul_tesis: string({
            required_error: "judul tesis tidak boleh kosong",
            invalid_type_error: "judul tesis harus bertipe huruf"
        }),
        dospem: array(dospemSchema).min(1, "Minimal harus ada satu dospem"),
        topik_tesis: array(topikTesisSchema).min(1, "Minimal harus ada satu topik tesis"),
    })
};

const paramsNim = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus huruf"
        })
    })
}

const updateJudulTesis = {
    body: object({
        judul_tesis: string({
            required_error: "judul tesis tidak boleh kosong",
            invalid_type_error: "judul tesis harus bertipe huruf"
        })
    })
}

export const payloadTesisMhsSchema = object({
    ...payload
});

export const payloadArrayTesisMhsSchema = object({
    ...payloadArrayTesisMhs
});

export const paramsNimSchema = object({
    ...paramsNim
});

export const updateJudulTesisSchema = object({
    ...updateJudulTesis
});


export type PayloadTesisMhsRequest = TypeOf<typeof payloadTesisMhsSchema>;
export type PayloadArrayTesisMhsRequest = TypeOf<typeof payloadArrayTesisMhsSchema>;
export type ParamsTesisMhsNimRequest = TypeOf<typeof paramsNimSchema>;
export type UpdateJudulTesisRequest = TypeOf<typeof updateJudulTesisSchema>;