import { agenda_pertemuan, kategori_agenda } from "@models/trx-agenda.models";
import { TypeOf, date, object, string, array, nativeEnum } from "zod";

const paramsNimAndTahun = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus huruf"
        }),
        tahun: string({
            required_error: "tahun tidak boleh kosong",
            invalid_type_error: "tahun harus huruf"
        })
    })
}

const paramsNimAndBulanTahun = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus huruf"
        }),
        bulan: string({
            required_error: "bulan tidak boleh kosong",
            invalid_type_error: "bulan harus huruf"
        }),
        tahun: string({
            required_error: "tahun tidak boleh kosong",
            invalid_type_error: "tahun harus huruf"
        })
    })
}

const paramsNimAndRangeTglBulanTahun = {
    params: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus huruf"
        }),
        tgl_awal: string({
            required_error: "tanggal awal tidak boleh kosong",
            invalid_type_error: "tanggal awal harus huruf"
        }),
        tgl_akhir: string({
            required_error: "tanggal akhir tidak boleh kosong",
            invalid_type_error: "tanggal akhir harus huruf"
        }),
        bulan: string({
            required_error: "bulan tidak boleh kosong",
            invalid_type_error: "bulan harus huruf"
        }),
        tahun: string({
            required_error: "tahun tidak boleh kosong",
            invalid_type_error: "tahun harus huruf"
        })
    })
}

const paramsNidnAndTahun = {
    params: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus huruf"
        }),
        tahun: string({
            required_error: "tahun tidak boleh kosong",
            invalid_type_error: "tahun harus huruf"
        })
    })
}

const paramsNidnAndBulanTahun = {
    params: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus huruf"
        }),
        bulan: string({
            required_error: "bulan tidak boleh kosong",
            invalid_type_error: "bulan harus huruf"
        }),
        tahun: string({
            required_error: "tahun tidak boleh kosong",
            invalid_type_error: "tahun harus huruf"
        })
    })
}

const paramsNidnAndRangeTglBulanTahun = {
    params: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus huruf"
        }),
        tgl_awal: string({
            required_error: "tanggal awal tidak boleh kosong",
            invalid_type_error: "tanggal awal harus huruf"
        }),
        tgl_akhir: string({
            required_error: "tanggal akhir tidak boleh kosong",
            invalid_type_error: "tanggal akhir harus huruf"
        }),
        bulan: string({
            required_error: "bulan tidak boleh kosong",
            invalid_type_error: "bulan harus huruf"
        }),
        tahun: string({
            required_error: "tahun tidak boleh kosong",
            invalid_type_error: "tahun harus huruf"
        })
    })
}

const paramsId = {
    params: object({
        id_trx_agenda: string({
            required_error: "id_trx_agenda tidak boleh kosong",
            invalid_type_error: "id_trx_agenda harus huruf"
        }),
    })
}

const dospemArray = object({
    nidn: string({
        required_error: "nidn tidak boleh kosong",
        invalid_type_error: "nidn harus bertipe huruf"
    })
});

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const payloadAgenda = {
    body: object({
        nim: string({
            required_error: "nim tidak boleh kosong",
            invalid_type_error: "nim harus bertipe huruf"
        }),
        dospem: array(dospemArray).min(1, "Minimal harus ada satu dospem"),
        agenda_pertemuan: nativeEnum(agenda_pertemuan),
        kategori_agenda: nativeEnum(kategori_agenda),
        keterangan_bimbingan: string({
            required_error: "keterangan bimbingan tidak boleh kosong",
            invalid_type_error: "keterangan bimbingan harus bertipe huruf"
        }),
        tgl_bimbingan: string({
            required_error: "Tanggal bimbingan tidak boleh kosong",
            invalid_type_error: "Tanggal bimbingan harus berupa string",
        }).refine((val) => datetimeRegex.test(val), {
            message: "Invalid datetime format. Expected format: YYYY-MM-DD HH:MM:SS",
        })
    })
};

export const payloadAgendaSchema = object({
    ...payloadAgenda
});

export const paramsIdSchema = object({
    ...paramsId
});

export const paramsNimAndTahunSchema = object({
    ...paramsNimAndTahun
});

export const paramsNimAndBulanTahunSchema = object({
    ...paramsNimAndBulanTahun
});

export const paramsNimAndRangeTglBulanTahunSchema = object({
    ...paramsNimAndRangeTglBulanTahun
});

export const paramsNidnAndTahunSchema = object({
    ...paramsNidnAndTahun
});

export const paramsNidnAndBulanTahunSchema = object({
    ...paramsNidnAndBulanTahun
});

export const paramsNidnAndRangeTglBulanTahunSchema = object({
    ...paramsNidnAndRangeTglBulanTahun
});

export type PayloadAgendaRequest = TypeOf<typeof payloadAgendaSchema>;
export type ParamsIdRequest = TypeOf<typeof paramsIdSchema>;
export type ParamsMhsNimAndTahunRequest = TypeOf<typeof paramsNimAndTahunSchema>;
export type ParamsMhsNimAndBulanTahunRequest = TypeOf<typeof paramsNimAndBulanTahunSchema>;
export type ParamsMhsNimAndRangeTglBulanTahunRequest = TypeOf<typeof paramsNimAndRangeTglBulanTahunSchema>;
export type ParamsDsnNidnAndTahunRequest = TypeOf<typeof paramsNidnAndTahunSchema>;
export type ParamsDsnNidnAndBulanTahunRequest = TypeOf<typeof paramsNidnAndBulanTahunSchema>;
export type ParamsDsnNidnAndRangeTglBulanTahunRequest = TypeOf<typeof paramsNidnAndRangeTglBulanTahunSchema>;