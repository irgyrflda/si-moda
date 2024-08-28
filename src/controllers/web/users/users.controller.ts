import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import Users, { UserInput, UserOutput } from "@models/users.models";
import CustomError from "@middleware/error-handler";
import { Op } from "sequelize";
import { cekNoInduk } from "@utils/cek-no-induk";
import users from "@services/web/users.service-web";
import RefGroupUser from "@models/ref-group-user.models";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const email: string = req.body.email
        const user = await Users.findOne({
            attributes: ["nomor_induk"],
            where: {
                [Op.or]: {
                    email_ecampus: {
                        [Op.like]: `%${email}%`
                    },
                    email_google: {
                        [Op.like]: `%${email}%`
                    }
                }
            }
        })
        console.log(user);
        
        if (!user) {
            responseSuccess(res, httpCode.ok, "Berhasil Login Silahkan Mengisi Data Diri Terlebih Dahulu", {
                status_user: false,
                data_user: null
            });
        } else {
            const updateToken = await Users.update({
                token: req.body.token,
                refresh_token: req.body.refresh_token,
                token_expired: req.body.token_expired
            }, {
                where: {
                    nomor_induk: user.nomor_induk
                }
            })
            if (!updateToken) throw new CustomError(httpCode.badRequest, "Gagal Login Silahkan Coba Lagi")
            const dataUser = await users.getByNomorIndukUser(user.nomor_induk)
            responseSuccess(res, httpCode.ok, "Berhasil Login", {
                status_user: true,
                data_user: dataUser
            });
        }
    } catch (error) {
        errorLogger.error("Error login frenn : ", error)
        next(error);
    }
}

export const getAllUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

}

export const getByNomorIndukUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

}

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await cekNoInduk(req.body.nomor_induk)
        const payload = {
            token: req.body.token,
            refresh_token: req.body.refresh_token,
            token_expired: req.body.token_expired,
            nomor_induk: req.body.nomor_induk,
            nama_user: user.nama,
            email_ecampus: req.body.email_ecampus,
            email_google: req.body.email_google,
            ucr: req.body.nomor_induk
        }
        const storeUser: UserInput = await users.storeUser(payload.token, payload.refresh_token,
            payload.token_expired, payload.nomor_induk, payload.nama_user,
            payload.email_ecampus, payload.email_google, payload.ucr
        )

        const cekRefUserGroup = await RefGroupUser.findOne({
            where: {
                nomor_induk: payload.nomor_induk,
                kode_group: user.kode_group
            }
        })

        if (!cekRefUserGroup) {
            const storeUserGroup = await RefGroupUser.create({
                nomor_induk: payload.nomor_induk,
                kode_group: user.kode_group
            })
            if (!storeUserGroup) throw new CustomError(httpCode.badRequest, "Error gagal mendaftarkan user pada aplikasi")
        }

        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", storeUser)

    } catch (error) {
        errorLogger.error("Error login frenn : ", error)
        next(error);
    }
}