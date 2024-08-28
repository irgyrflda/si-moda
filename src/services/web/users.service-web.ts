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
import { errorLogger } from "@config/logger";

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
        console.log("debug 1");

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
        console.log("debug 2 : ", user);
        if (!user) throw new CustomError(httpCode.noContent, "Data Tidak Ditemukan");
        console.log("debug 3");
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
    token_expired: Date,
    nomor_induk: string,
    nama_user: string,
    email_ecampus: string | null | undefined,
    email_google: string | null | undefined,
    ucr: string
): Promise<UserInput> => {
    try {
        const cekUser = await Users.findOne({
            where: {
                nomor_induk: nomor_induk
            }
        })
        if (cekUser) throw new CustomError(httpCode.conflict, "Nomor induk sudah terdaftar")

        const payloadUser: UserInput = {
            nama_user: nama_user,
            email_ecampus: email_ecampus,
            email_google: email_google,
            uu: ucr,
            nomor_induk: nomor_induk,
            token: token,
            refresh_token: refresh_token,
            token_expired: token_expired
        }

        const create = await Users.create(payloadUser)

        if (!create) throw new CustomError(httpCode.badRequest, "Gagal membuat user");

        return create;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
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