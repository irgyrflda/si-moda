import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import RefTesisMhs from "./ref-tesis-mhs.models";

export enum keterangan_seminar {
    proposal = "proposal",
    hasil = "hasil"
}

interface ITrxSeminarMhsAttributes {
    id_trx_seminar: number | null | undefined;
    nim: string;
    keterangan_seminar: keterangan_seminar;
    url_path_pdf: string;
    url_path_materi_ppt: string;
    tgl_upload: string;
    tgl_review: string | null | undefined;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}


export type TrxSeminarMhsOutput = Required<ITrxSeminarMhsAttributes>;
export type TrxSeminarMhsInput = Optional<
    ITrxSeminarMhsAttributes,
    "id_trx_seminar" | "tgl_review" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxSeminarMhs
    extends Model<ITrxSeminarMhsAttributes, TrxSeminarMhsInput>
    implements ITrxSeminarMhsAttributes {
    declare id_trx_seminar: number | null | undefined;
    declare nim: string;
    declare keterangan_seminar: keterangan_seminar;
    declare url_path_pdf: string;
    declare url_path_materi_ppt: string;
    declare tgl_upload: string;
    declare tgl_review: string | null | undefined;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxSeminarMhs.init(
    {
        id_trx_seminar: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nim: {
            type: DataTypes.STRING,
            allowNull: false
        },
        keterangan_seminar: {
            type: DataTypes.ENUM("proposal", "hasil"),
            allowNull: true,
            defaultValue: "proposal"
        },
        url_path_pdf: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url_path_materi_ppt: {
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
        tableName: "trx_seminar_mhs",
        modelName: "TrxSeminarMhs",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxSeminarMhs.hasMany(RefTesisMhs, {
    as: "seminar_tesis",
    foreignKey: "nim"
});

RefTesisMhs.belongsTo(TrxSeminarMhs, {
    as: "tesis_seminar",
    foreignKey: "nim"
});

export default TrxSeminarMhs;