import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import RefTesisMhs from "./ref-tesis-mhs.models";
import SubMateriPembahasan from "./sub-materi-pembahasan.models";

interface ITrxBimbinganMhsAttributes {
    id_trx_bimbingan: number | null | undefined;
    nim: string;
    id_sub_materi_pembahasan: number;
    url_path_doc: string;
    tgl_upload: string;
    tgl_review: string | null | undefined;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type TrxBimbinganMhsOutput = Required<ITrxBimbinganMhsAttributes>;
export type TrxBimbinganMhsInput = Optional<
    ITrxBimbinganMhsAttributes,
    "id_trx_bimbingan" | "tgl_review" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxBimbinganMhs
    extends Model<ITrxBimbinganMhsAttributes, TrxBimbinganMhsInput>
    implements ITrxBimbinganMhsAttributes {
    declare id_trx_bimbingan: number | null | undefined;
    declare nim: string;
    declare id_sub_materi_pembahasan: number;
    declare url_path_doc: string;
    declare tgl_upload: string;
    declare tgl_review: string | null | undefined;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxBimbinganMhs.init(
    {
        id_trx_bimbingan: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nim: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_sub_materi_pembahasan: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url_path_doc: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tgl_upload: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tgl_review: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: "trx_bimbingan_mhs",
        modelName: "TrxBimbinganMhs",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxBimbinganMhs.hasMany(RefTesisMhs, {
    as: "bimbingan_tesis",
    foreignKey: "nim"
});

RefTesisMhs.belongsTo(TrxBimbinganMhs, {
    as: "tesis_bimbingan",
    foreignKey: "nim"
});

TrxBimbinganMhs.hasMany(SubMateriPembahasan, {
    as: "submateri_bimbingan",
    foreignKey: "id_sub_materi_pembahasan"
});

SubMateriPembahasan.belongsTo(TrxBimbinganMhs, {
    as: "bimbingan_submateri",
    foreignKey: "id_sub_materi_pembahasan"
})

export default TrxBimbinganMhs;