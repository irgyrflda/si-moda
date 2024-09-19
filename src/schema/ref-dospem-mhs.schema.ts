import { TypeOf, object, string, nativeEnum, number, array } from "zod";
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

const payloadPersetujuan = {
    body: object({
        status_persetujuan: nativeEnum(status_persetujuan_dospem_mhs)
    })
}

const payloadPersetujuanIdAndStatus = object({
    id_dospem_mhs: number({
        required_error: "id dospem mhs tidak boleh kosong",
        invalid_type_error: "id dospem mhs harus bertipe angka"
    }),
    status_persetujuan: nativeEnum(status_persetujuan_dospem_mhs)
})

const payloadPersetujuanArray = {
    body: object({
        persetujuan: array(payloadPersetujuanIdAndStatus).min(1, "Minimal harus ada satu persetujuan")
    })
}

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

const paramsNidn = {
    params: object({
        nidn: string({
            required_error: "nidn tidak boleh kosong",
            invalid_type_error: "nidn harus bertipe huruf"
        }),
    })
}

const paramsKetDospem = {
    params: object({
        keterangan_dospem: nativeEnum(keterangan_dospem)
    })
}

export const paramsKetDospemSchema = object({
    ...paramsKetDospem
});

export const payloadSchema = object({
    ...payload
});

export const payloadPersetujuanSchema = object({
    ...payloadPersetujuan
});

export const payloadPersetujuanArraySchema = object({
    ...payloadPersetujuanArray
})

export const paramsIdSchema = object({
    ...paramsId
});

export const paramsNimSchema = object({
    ...paramsNim
});

export const paramsNidnSchema = object({
    ...paramsNidn
});

export type ParamsKetDospemRequest = TypeOf<typeof paramsKetDospemSchema>;
export type PayloadRequest = TypeOf<typeof payloadSchema>;
export type PayloadPersetujuanRequest = TypeOf<typeof payloadPersetujuanSchema>;
export type PayloadPersetujuanArrayRequest = TypeOf<typeof payloadPersetujuanArraySchema>;
export type ParamsIdRequest = TypeOf<typeof paramsIdSchema>;
export type ParamsNimRequest = TypeOf<typeof paramsNimSchema>;
export type ParamsNidnRequest = TypeOf<typeof paramsNidnSchema>;