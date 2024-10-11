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
import { decryptWithKey, encryptWithKey } from "@utils/generate-encrypt-decrypt";
import getConfig from "@config/dotenv";
import TrxTopikUser from "@models/trx-topik-penelitian.models";
import TrxSeminarMhs from "@models/trx-seminar-mhs.models";
import TrxNotifikasi from "@models/trx-notifikasi.models";
import TrxMasukanSeminar from "@models/trx-masukan-seminar.model";
import TrxMasukanDsn from "@models/trx-masukan-dospem.models";
import TrxBimbinganMhs from "@models/trx-bimbingan-mhs.models";
import TrxAgenda from "@models/trx-agenda.models";
import RefTesisMhs from "@models/ref-tesis-mhs.models";
import SeminarMhs from "@models/ref-seminar-mhs.models";
import RefDosepemMhs from "@models/ref-dospem-mhs.models";
import BimbinganMhs from "@models/bimbingan-mhs.models";
import db from "@config/database";
import { PayloadUploadJsonDsnRequest, PayloadUploadJsonMhsRequest } from "@schema/users.schema";
import path from "path";
import fs from "fs";
import dataMhs from "@public/data-dummy-mhs.json";
import dataDsn from "@public/data-dummy-dsn.json";
import RefDosepem from "@models/ref-dospem.models";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const email: string = req.body.email
        const password: string = req.body.password
        const user = await Users.findAll({
            attributes: ["nomor_induk", "password"],
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
            const encryptedData = encryptWithKey(password, getConfig("SESSION_KEY"))

            const cekUnserSemantara = await RefUserSementara.findOne({
                where: {
                    email: email
                }
            })
            if (cekUnserSemantara) {
                const userSementaraPassword = await RefUserSementara.findOne({
                    attributes: ["password"],
                    where: {
                        email: email
                    }
                });

                if (!userSementaraPassword) throw new CustomError(httpCode.notFound, "User Tidak Ditamukan")
                const passwordDecrypt = decryptWithKey(cekUnserSemantara.password, getConfig("SESSION_KEY"))

                if (password !== passwordDecrypt) throw new CustomError(httpCode.badRequest, "Email Atau Password Salah")
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
                    refresh_token: refreshTokenJwt,
                    password: encryptedData
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
            const passwordDecrypt = decryptWithKey(user[0].password, getConfig("SESSION_KEY"))
            if (password !== passwordDecrypt) throw new CustomError(httpCode.badRequest, "Email Atau Password Salah")
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
        const passwordEncrypt = encryptWithKey(req.body.password, getConfig("SESSION_KEY"))

        const payload = {
            token: tokenUser,
            refresh_token: refreshToken,
            password: passwordEncrypt,
            nomor_induk: req.body.nomor_induk,
            nama_user: user.nama,
            email_ecampus: req.body.email_ecampus,
            email_google: req.body.email_google,
            ucr: req.body.nomor_induk
        }
        const storeUser: UserInput = await users.storeUser(
            payload.token,
            payload.refresh_token,
            payload.password,
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
        // await RefUserSementara.destroy({ where: { email: req.headers.email } })
        const dataUser = await users.getByNomorIndukUser(payload.nomor_induk)
        responseSuccess(res, httpCode.ok, "Berhasil Membuat Data", dataUser)

    } catch (error) {
        errorLogger.error("Error login frenn : ", error)
        next(error);
    }
}

export const deleteData = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await TrxTopikUser.destroy({ truncate: true })
        await TrxSeminarMhs.destroy({ truncate: true })
        await TrxNotifikasi.destroy({ truncate: true })
        await TrxMasukanSeminar.destroy({ truncate: true })
        await TrxMasukanDsn.destroy({ truncate: true })
        await TrxBimbinganMhs.destroy({ truncate: true })
        await TrxAgenda.destroy({ truncate: true })
        await RefUserSementara.destroy({ truncate: true })
        await SeminarMhs.destroy({ truncate: true })
        await RefDosepemMhs.destroy({ truncate: true })
        await BimbinganMhs.destroy({ truncate: true })
        await RefGroupUser.destroy({ truncate: true })
        await RefTesisMhs.destroy({ truncate: true })
        await Users.destroy({ truncate: true })
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        responseSuccess(res, httpCode.ok, "Berhasil Menghapus seluruh Data")

    } catch (error) {
        errorLogger.error("Error delete data : ", error)
        next(error);
    }
};

export const uploadDataMhs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const email = req.headers.email
        const checkRoleUser = await RefGroupUser.findOne({
            attributes: ["kode_group"],
            include: [
                {
                    model: Users,
                    as: "user_group",
                    attributes: ["nomor_induk"],
                    where: {
                        [Op.or]: [{ email_google: email }, { email_ecampus: email }]
                    }
                }
            ],
            where: {
                kode_group: "G07"
            }
        });

        if (!checkRoleUser) throw new CustomError(httpCode.badRequest, "Akses User Dibatasi: (hanya user tertentu yang dapat upload)")

        const data: PayloadUploadJsonMhsRequest["body"] = req.body;
        const filePath = path.join(__dirname, "..", "..", "..", "public", "data-dummy-mhs.json");
        const dataTesisMhs = dataMhs;

        dataTesisMhs.forEach((i) => {
            const exists = data.some((o) => i.nomor_induk_mahasiswa === o.nomor_induk_mahasiswa)

            if (!exists) {
                data.push(i)
            }
        });

        fs.writeFile(filePath, JSON.stringify(data, null, 2), (error) => {
            if (error) {
                throw new CustomError(httpCode.badRequest, "Gagal upload data")
            }
            responseSuccess(res, httpCode.ok, "Berhasil Upload Data")
        });
    } catch (error) {
        errorLogger.error("Error upload data mhs : ", error)
        next(error);
    }
};

export const uploadDataDsn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        const email = req.headers.email
        const checkRoleUser = await RefGroupUser.findOne({
            attributes: ["kode_group"],
            include: [
                {
                    model: Users,
                    as: "user_group",
                    attributes: ["nomor_induk"],
                    where: {
                        [Op.or]: [{ email_google: email }, { email_ecampus: email }]
                    }
                }
            ],
            where: {
                kode_group: "G07"
            }
        });

        if (!checkRoleUser) throw new CustomError(httpCode.badRequest, "Akses User Dibatasi: (hanya user tertentu yang dapat upload)")

        const data: PayloadUploadJsonDsnRequest["body"] = req.body;
        const filePath = path.join(__dirname, "..", "..", "..", "public", "data-dummy-dsn.json")
        const dataDsnEksis = dataDsn;
        dataDsnEksis.forEach((i) => {
            const exists = data.some((o) => i.nomor_induk_dosen_nasional === o.nomor_induk_dosen_nasional)

            if (!exists) {
                data.push(i)
            }
        });
        const dataDosenEksTable = await RefDosepem.findAll({
            attributes: ["nidn"]
        });

        let dataDsnNew: any[] = []
        data.forEach((i) => {
            const exists = dataDosenEksTable.some((o) => i.nomor_induk_dosen_nasional === o.nidn)

            if (!exists) {
                dataDsnNew.push({
                    nidn: i.nomor_induk_dosen_nasional,
                    nama_dospem: i.nama
                })
            }
        });

        if (dataDsn.length !== 0) {
            await RefDosepem.bulkCreate(dataDsnNew)
        }

        fs.writeFile(filePath, JSON.stringify(data, null, 2), (error) => {
            if (error) {
                throw new CustomError(httpCode.badRequest, "Gagal upload data")
            }
            responseSuccess(res, httpCode.ok, "Berhasil Upload Data")
        });
    } catch (error) {
        errorLogger.error("Error upload data mhs : ", error)
        next(error);
    }
};