import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import Menu2 from "./menu2-group.models";

interface IMenu3Attributes {
    kode_menu2: string;
    kode_menu3: string;
    nama_menu3: string;
}

export type GroupOutput = Required<IMenu3Attributes>;
export type GroupInput = Required<IMenu3Attributes>;

class Menu3
    extends Model<IMenu3Attributes, GroupInput>
    implements IMenu3Attributes {
    declare kode_menu2: string;
    declare kode_menu3: string;
    declare nama_menu3: string;
}

Menu3.init(
    {
        kode_menu2: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        kode_menu3: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false
        },
        nama_menu3: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    },
    {
        sequelize: db,
        tableName: "ref_menu3",
        modelName: "Menu3",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

Menu2.hasMany(Menu3, {
    as: "menu3",
    foreignKey: "kode_menu2"
})

Menu3.belongsTo(Menu2, {
    as: "menu2",
    foreignKey: "kode_menu2"
})

export default Menu3;