import CustomError from "@middleware/error-handler";
import GroupUser, { GroupInput, GroupOutput } from "@models/group-user.models";
import { httpCode } from "@utils/prefix";

const getAllServiceGroupUser = async (): Promise<GroupOutput[]> => {
    try {
        const groupUser: GroupUser[] = await GroupUser.findAll()
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

export default getAllServiceGroupUser;