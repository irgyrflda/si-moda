import CustomError from "@middleware/error-handler";
import RefGroupUser, { RefGroupInput, RefGroupOutput } from "@models/ref-group-user.models";
import { ParamsNimKodeGroupRefGroupUsersRequest } from "@schema/ref-group-user.schema";
import { httpCode } from "@utils/prefix";

const getAllServiceRefGroupUser = async (): Promise<RefGroupOutput[]> => {
    try {
        const groupUser: RefGroupUser[] = await RefGroupUser.findAll()
        if (!groupUser || groupUser.length === 0) throw new CustomError(httpCode.found, "Data Tidak Ditemukan");
        return groupUser;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const getServiceRefGroupUserByNimAndKodeGroup = async (
    nomor_induk: ParamsNimKodeGroupRefGroupUsersRequest["params"]["nomor_induk"],
    kode_group: ParamsNimKodeGroupRefGroupUsersRequest["params"]["kode_group"]
): Promise<RefGroupOutput> => {
    try {
        const groupUser: RefGroupUser | null = await RefGroupUser.findOne({
            where: {
                nomor_induk: nomor_induk,
                kode_group: kode_group
            }
        })
        if (!groupUser) throw new CustomError(httpCode.found, "Data Tidak Ditemukan");
        return groupUser;
    } catch (error: any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            console.log(`error : ${error}`);
            throw new CustomError(500, "Internal server error.");
        }
    }
}

const storeUserGroup = async (
    nomor_induk: string,
    kode_group: string
): Promise<RefGroupInput> => {
    try {
        const cekUserGroup = await RefGroupUser.findOne({
            where: {
                nomor_induk: nomor_induk,
                kode_group: kode_group
            }
        })

        if (cekUserGroup) throw new CustomError(httpCode.conflict, "Nomor induk pada role tersebut sudah terdaftar")

        const payload: RefGroupInput = {
            kode_group: kode_group,
            nomor_induk: nomor_induk
        }
        const storePayload = await RefGroupUser.create(payload)

        if (!storePayload) throw new CustomError(httpCode.badRequest, "Gagal membuat group user");

        return storePayload;
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
        } else {
            throw new CustomError(500, "Internal server error.");
        }
    }
}

export default {
    getAllServiceRefGroupUser,
    storeUserGroup,
    getServiceRefGroupUserByNimAndKodeGroup
};