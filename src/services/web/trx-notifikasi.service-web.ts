import db from "@config/database";
import { debugLogger } from "@config/logger";
import CustomError from "@middleware/error-handler";
import TrxNotifikasi, { TrxNotifikasiInput, TrxNotifikasiOutput } from "@models/trx-notifikasi.models";
import { ParamsNomorIndukNotifRequest, PayloadNotifRequest } from "@schema/trx-notifikasi.schema";
import { httpCode } from "@utils/prefix";

const getNotifByNomorInduk = async (
    nomor_induk: ParamsNomorIndukNotifRequest["params"]["nomor_induk"],
) => {
    try {
        const getNotif = await TrxNotifikasi.findAll({
            attributes: ["id_notif", "isi_notif", "status_notif"],
            where: { nomor_induk: nomor_induk },
            order: [[db.literal('status_notif'), 'ASC']]
        })

        return getNotif
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getCountNotifByNomorInduk = async (
    nomor_induk: ParamsNomorIndukNotifRequest["params"]["nomor_induk"],
) => {
    try {
        const getNotif = await TrxNotifikasi.findAll({
            attributes: [
                [db.fn('COUNT', db.col('id_notif')), 'total_notif']
            ],
            where: {
                nomor_induk: nomor_induk,
                status_notif: "1"
            },
            group: ["nomor_induk"]
        })

        return (getNotif.length === 0) ? [{ total_notif: 0 }] : getNotif;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const createNotif = async (
    noInduk: string,
    IsiNotif: string,
): Promise<TrxNotifikasiInput> => {
    try {
        const payload = {
            nomor_induk: noInduk,
            isi_notif: IsiNotif
        }

        const createNotif = await TrxNotifikasi.create(payload)

        return createNotif;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const updateNotif = async (
    idNotif: number,
) => {
    try {
        const updateNotif = await TrxNotifikasi.update({
            status_notif: "0"
        }, {
            where: { id_notif: idNotif }
        })

        return updateNotif;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getNotifByNomorInduk,
    getCountNotifByNomorInduk,
    createNotif,
    updateNotif
}