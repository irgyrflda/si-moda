import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IGroupAttributes {
    kode_group: string;
    nama_group: string;
}

export type GroupOutput = Required<IGroupAttributes>;
export type GroupInput = Required<IGroupAttributes>;

class GroupUser
    extends Model<IGroupAttributes, GroupInput>
    implements IGroupAttributes {
    declare kode_group: string;
    declare nama_group: string;
}

GroupUser.init(
    {
        kode_group: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false
        },
        nama_group: {
            type: DataTypes.STRING(5),
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: "m_group",
        modelName: "GroupUser",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

export default GroupUser;