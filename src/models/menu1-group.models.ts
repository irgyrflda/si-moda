import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import GroupUser from "./group-user.models";

interface IMenu1Attributes {
    kode_group: string;
    kode_menu1: string;
    nama_menu1: string;
}

export type GroupOutput = Required<IMenu1Attributes>;
export type GroupInput = Required<IMenu1Attributes>;

class Menu1
    extends Model<IMenu1Attributes, GroupInput>
    implements IMenu1Attributes {
    declare kode_group: string;
    declare kode_menu1: string;
    declare nama_menu1: string;
}

Menu1.init(
    {
        kode_group: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        kode_menu1: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false
        },
        nama_menu1: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    },
    {
        sequelize: db,
        tableName: "ref_menu1",
        modelName: "Menu1",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

GroupUser.hasMany(Menu1, {
    as: "menu1",
    foreignKey: "kode_group"
})

Menu1.belongsTo(GroupUser, {
    as: "group",
    foreignKey: "kode_group"
})

export default Menu1;