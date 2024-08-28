import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import Menu1 from "./menu1-group.models";

interface IMenu2Attributes {
    kode_menu1: string;
    kode_menu2: string;
    nama_menu2: string;
}

export type GroupOutput = Required<IMenu2Attributes>;
export type GroupInput = Required<IMenu2Attributes>;

class Menu2
    extends Model<IMenu2Attributes, GroupInput>
    implements IMenu2Attributes {
    declare kode_menu1: string;
    declare kode_menu2: string;
    declare nama_menu2: string;
}

Menu2.init(
    {
        kode_menu1: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        kode_menu2: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false
        },
        nama_menu2: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    },
    {
        sequelize: db,
        tableName: "ref_menu2",
        modelName: "Menu2",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

Menu1.hasMany(Menu2, {
    as: "menu2",
    foreignKey: "kode_menu1"
})

Menu2.belongsTo(Menu1, {
    as: "menu1",
    foreignKey: "kode_menu1"
})

export default Menu2;