import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import Status from "./ref-status.models";

interface IRefTesisMhsAttributes {
    nim: string;
    judul_tesis: string;
    kode_status: string | null | undefined;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type RefTesisMhsOutput = Required<IRefTesisMhsAttributes>;
export type RefTesisMhsInput = Optional<
    IRefTesisMhsAttributes,
    "kode_status" | "uc" | "uu" | "created_at" | "update_at"
>;

class RefTesisMhs
    extends Model<IRefTesisMhsAttributes, RefTesisMhsInput>
    implements IRefTesisMhsAttributes {
    declare nim: string;
    declare judul_tesis: string;
    declare kode_status: string | null | undefined;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

RefTesisMhs.init(
    {
        nim: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        judul_tesis: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kode_status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "T01"
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
        tableName: "ref_tesis_mahasiswa",
        modelName: "RefTesisMhs",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

Status.hasMany(RefTesisMhs, {
    as: "tesis",
    foreignKey: "kode_status"
});

RefTesisMhs.belongsTo(Status, {
    as: "status",
    foreignKey: "kode_status"
})

export default RefTesisMhs;