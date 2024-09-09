import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IRefDospemAttributes {
    nidn: string;
    nama_dospem: string;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type RefDospemOutput = Required<IRefDospemAttributes>;
export type RefDospemInput = Optional<
IRefDospemAttributes,
"uc" | "uu" | "created_at" | "update_at"
>;

class RefDosepem
    extends Model<IRefDospemAttributes, RefDospemInput>
    implements IRefDospemAttributes {
    declare nidn: string;
    declare nama_dospem: string;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

RefDosepem.init(
    {
        nidn: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        nama_dospem: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uc: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        uu: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE(),
            allowNull: true
        },
        update_at: {
            type: DataTypes.DATE(),
            allowNull: true
        }
    },
    {
        sequelize: db,
        tableName: "ref_dospem",
        modelName: "RefDosepem",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

export default RefDosepem;