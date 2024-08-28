import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import Users from "./users.models";
import GroupUser from "./group-user.models";

interface IRefGroupAttributes {
    id_group_user: number;
    nomor_induk: string;
    kode_group: string;
}

export type RefGroupOutput = Required<IRefGroupAttributes>;
export type RefGroupInput = Optional<
    IRefGroupAttributes,
    "id_group_user"
>;

class RefGroupUser
    extends Model<IRefGroupAttributes, RefGroupInput>
    implements IRefGroupAttributes {
    declare id_group_user: number;
    declare nomor_induk: string;
    declare kode_group: string;
}

RefGroupUser.init(
    {
        id_group_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomor_induk: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kode_group: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: "ref_group_user",
        modelName: "RefGroupUser",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

Users.hasMany(RefGroupUser, {
    as: "group_user",
    foreignKey: "nomor_induk"
})

RefGroupUser.belongsTo(Users, {
    as: "user_group",
    foreignKey: "nomor_induk"
})

GroupUser.hasMany(RefGroupUser, {
    as: "ref_group",
    foreignKey: "kode_group"
})

RefGroupUser.belongsTo(GroupUser, {
    as: "m_group",
    foreignKey: "kode_group"
})

export default RefGroupUser;