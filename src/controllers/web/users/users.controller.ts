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
import { generateAccessToken, generateRefreshToken, refreshToken } from "@middleware/authorization";
import RefUserSementara, { RefUserSementaraInput, RefUserSementaraOutput } from "@models/user-sementara.models";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const email: string = req.body.email
        const user = await Users.findAll({
            attributes: ["nomor_induk"],
            where: {
                [Op.or]: {
                    email_ecampus: email,
                    email_google: email
                }
            }
        })
        const tokenJwt = generateAccessToken(email)
        const refreshTokenJwt = generateRefreshToken(email)
        const auth = {
            token: tokenJwt,
            refresh_token: refreshTokenJwt
        }
        if (user.length === 0) {
            const cekUnserSemantara = await RefUserSementara.findOne({
                where: {
                    email: email
                }
            })
            if (cekUnserSemantara) {
                const updateUserSemantara = await RefUserSementara.update({
                    token: tokenJwt
                }, {
                    where: {
                        email: email
                    }
                })
                if (!updateUserSemantara) throw new CustomError(httpCode.badRequest, "Gagal Login[0]")
            } else {
                const payloadUserSemantara: RefUserSementaraInput = {
                    email: email,
                    token: tokenJwt,
                    refresh_token: refreshTokenJwt
                }
                const postUserSemantara: RefUserSementaraInput = await RefUserSementara.create(payloadUserSemantara)
                if (!postUserSemantara) throw new CustomError(httpCode.badRequest, "Gagal Login[1]")
            }
            responseSuccess(res, httpCode.ok, "Berhasil Login Silahkan Mengisi Data Diri Terlebih Dahulu", {
                status_user: false,
                auth: auth,
                data_user: null
            });
        } else {
            const updateToken = await Users.update({
                token: tokenJwt,
                refresh_token: refreshTokenJwt,
                // token_expired: req.body.token_expired
            }, {
                where: {
                    nomor_induk: user[0].nomor_induk
                }
            })
            if (!updateToken) throw new CustomError(httpCode.badRequest, "Gagal Login Silahkan Coba Lagi")
            const dataUser = await users.getByNomorIndukUser(user[0].nomor_induk)
            responseSuccess(res, httpCode.ok, "Berhasil Login", {
                status_user: true,
                auth: auth,
                data_user: dataUser
            });
        }
    } catch (error) {
        errorLogger.error("Error login : ", error)
        next(error);
    }
}

export const refreshTokenUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const refreshTokenBaru = refreshToken(req.body.email, req.body.refresh_token)

        const updateTokenUser = await Users.update({
            token: refreshTokenBaru.token,
            refresh_token: refreshTokenBaru.refresh_token
        }, {
            where: {
                [Op.or]:
                    [
                        {
                            email_ecampus: req.body.email
                        },
                        {
                            email_google: req.body.email
                        }
                    ]
            }
        });

        if (!updateTokenUser) {
            throw new CustomError(httpCode.badRequest, "Gagal Refresh Token")
        }
        responseSuccess(res, httpCode.ok, "Berhasil Refresh Token", refreshTokenBaru)
    } catch (error) {
        errorLogger.error("Error refresh token : ", error)
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
        const tokenUser: any = req.headers.token
        const refreshToken: any = req.headers.refresh_token
        const user = await cekNoInduk(req.body.nomor_induk)

        const payload = {
            token: tokenUser,
            refresh_token: refreshToken,
            // token_expired: req.body.token_expired,
            nomor_induk: req.body.nomor_induk,
            nama_user: user.nama,
            email_ecampus: req.body.email_ecampus,
            email_google: req.body.email_google,
            ucr: req.body.nomor_induk
        }
        const storeUser: UserInput = await users.storeUser(
            payload.token,
            payload.refresh_token,
            // payload.token_expired, 
            payload.nomor_induk,
            payload.nama_user,
            payload.email_ecampus,
            payload.email_google,
            payload.ucr
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
        await RefUserSementara.destroy({ where: { email: req.headers.email } })
        const dataUser = await users.getByNomorIndukUser(payload.nomor_induk)
        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", dataUser)

    } catch (error) {
        errorLogger.error("Error login frenn : ", error)
        next(error);
    }
}