import CustomError from "@middleware/error-handler";
import Users, { UserInput, UserOutput } from "@models/users.models";
import RefGroupUser from "@models/ref-group-user.models";
import GroupUser from "@models/group-user.models";
import Menu1 from "@models/menu1-group.models";
import Menu2 from "@models/menu2-group.models";
import Menu3 from "@models/menu3-group.models";
import { httpCode } from "@utils/prefix";
import {
    PayloadUsersRequest,
    ParamsNimUsersRequest
} from "@schema/users.schema";
import { Op } from "sequelize";
import { debugLogger, errorLogger } from "@config/logger";

const getAllUsers = async (): Promise<UserOutput[]> => {
    try {
        const user: Users[] = await Users.findAll()
        if (!user || user.length === 0) throw new CustomError(httpCode.noContent, "Data Tidak Ditemukan");
        return user;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByNomorIndukUserParams = async (
    nomor_induk: ParamsNimUsersRequest["params"]["nomor_induk"]
): Promise<UserOutput> => {
    try {
        const user = await Users.findOne({
            include: [
                {
                    model: RefGroupUser,
                    as: "group_user",
                    include: [
                        {
                            model: GroupUser,
                            as: "m_group",
                            include: [
                                {
                                    model: Menu1,
                                    as: "menu1",
                                    include: [
                                        {
                                            model: Menu2,
                                            as: "menu2",
                                            include: [
                                                {
                                                    model: Menu3,
                                                    as: "menu3"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                nomor_induk: nomor_induk
            }
        });
        if (!user) throw new CustomError(httpCode.noContent, "Data Tidak Ditemukan");
        return user;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            errorLogger.error(error)
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByNomorIndukUser = async (
    nomor_induk: string
): Promise<UserOutput> => {
    try {
        const user = await Users.findOne({
            attributes: ["nomor_induk", "nama_user", "email_google", "email_ecampus"],
            include: [
                {
                    model: RefGroupUser,
                    as: "group_user",
                    include: [
                        {
                            model: GroupUser,
                            as: "m_group",
                            include: [
                                {
                                    model: Menu1,
                                    as: "menu1",
                                    include: [
                                        {
                                            model: Menu2,
                                            as: "menu2",
                                            include: [
                                                {
                                                    model: Menu3,
                                                    as: "menu3"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                nomor_induk: nomor_induk
            }
        });
        if (!user) throw new CustomError(httpCode.noContent, "Data Tidak Ditemukan");
        return user;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            errorLogger.error(error)
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getByEmailUser = async (
    email: string
): Promise<UserOutput> => {
    try {
        const user = await Users.findOne({
            include: [
                {
                    model: GroupUser,
                    as: "user",
                    include: [
                        {
                            model: Menu1,
                            as: "menu1",
                            include: [
                                {
                                    model: Menu2,
                                    as: "menu2",
                                    include: [
                                        {
                                            model: Menu3,
                                            as: "menu3"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
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
        });
        if (!user) throw new CustomError(httpCode.noContent, "Data Tidak Ditemukan");
        return user;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeUser = async (
    token: string,
    refresh_token: string,
    password: string,
    nomor_induk: string,
    nama_user: string | null | undefined,
    email_ecampus: string | null | undefined,
    email_google: string | null | undefined,
    ucr: string
): Promise<UserInput> => {
    try {
        const email = (!email_ecampus) ? ((!email_google) ? email_ecampus : email_google) : email_ecampus
        const cekUserByEmail = await Users.findAll({
            where: {
                [Op.or]: {
                    email_ecampus: email,
                    email_google: email
                }
            }
        })

        if (cekUserByEmail.length !== 0) throw new CustomError(httpCode.conflict, "Email Sudah Terdaftar")

        const cekUser = await Users.findOne({
            where: {
                nomor_induk: nomor_induk,
                // [Op.or]: {
                //     email_ecampus: email_ecampus,
                //     email_google: email_google
                // }
            }
        })
        // if (cekUser) throw new CustomError(httpCode.conflict, "Nomor induk sudah terdaftar")

        let user: any
        const cekEmailEcampus: null | undefined | string = cekUser?.email_ecampus;
        const cekEmailGoogle: null | undefined | string = cekUser?.email_google;
        if (cekEmailEcampus && cekEmailGoogle) throw new CustomError(httpCode.conflict, "Email Sudah Ada")

        if (cekEmailEcampus && email_ecampus) throw new CustomError(httpCode.conflict, "Email ecampus pada nomor induk ini sudah terkait")

        if (cekEmailGoogle && email_google) throw new CustomError(httpCode.conflict, "Email google pada nomor induk ini sudah terkait")

        if (cekUser) {
            const cekUser2: any = await Users.findOne({
                where: {
                    nomor_induk: nomor_induk,
                    [Op.or]: {
                        email_ecampus: email_ecampus,
                        email_google: email_google
                    }
                }
            })

            if (cekUser2) throw new CustomError(httpCode.conflict, "Nomor induk dan email sudah terdaftar")

            const payloadUpdate = {
                nama_user: nama_user,
                email_ecampus: (!email_ecampus || email_ecampus === "") ? cekEmailEcampus : email_ecampus,
                email_google: (!email_google || email_google === "") ? cekEmailGoogle : email_google,
                uu: ucr,
                nomor_induk: nomor_induk,
            }

            user = await Users.update(payloadUpdate, { where: { nomor_induk: nomor_induk } })

            if (!user) throw new CustomError(httpCode.badRequest, "Gagal membuat user[0]");
        } else {
            const payloadUser: UserInput = {
                token: token,
                refresh_token: refresh_token,
                nama_user: nama_user,
                password: password,
                email_ecampus: (!email_ecampus || email_ecampus === "") ? cekEmailEcampus : email_ecampus,
                email_google: (!email_google || email_google === "") ? cekEmailGoogle : email_google,
                uu: ucr,
                nomor_induk: nomor_induk,
                // token_expired: token_expired
            }

            debugLogger.debug("debug 1 : ", payloadUser)
            user = await Users.create(payloadUser)
            debugLogger.debug("debug 2 : ", user)
            if (!user) throw new CustomError(httpCode.badRequest, "Gagal membuat user[1]");
            debugLogger.debug("debug 3")
        }

        return user;
    } catch (error) {
        errorLogger.debug("debug error : ", error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error. " + error);
        }
    }
}

export default {
    getAllUsers,
    getByEmailUser,
    getByNomorIndukUser,
    storeUser,
    getByNomorIndukUserParams
}