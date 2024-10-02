import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import RefDosepemMhs from "./ref-dospem-mhs.models";
import TrxSeminarMhs from "./trx-seminar-mhs.models";

interface ISeminarMhsAttributes {
    id_seminar_mhs: number | null | undefined;
    id_trx_seminar: number | null | undefined;
    id_dospem_mhs: number | null | undefined;
    tgl_detail_review: string | null | undefined;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type SeminarMhsOutput = Required<ISeminarMhsAttributes>;
export type SeminarMhsInput = Optional<
    ISeminarMhsAttributes,
    "id_seminar_mhs" | "tgl_detail_review" | "uc" | "uu" | "created_at" | "update_at"
>;

class SeminarMhs
    extends Model<ISeminarMhsAttributes, SeminarMhsInput>
    implements ISeminarMhsAttributes {
    declare id_seminar_mhs: number | null | undefined;
    declare id_trx_seminar: number;
    declare id_dospem_mhs: number;
    declare tgl_detail_review: string | null | undefined;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

SeminarMhs.init(
    {
        id_seminar_mhs: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_trx_seminar: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_dospem_mhs: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tgl_detail_review: {
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
        tableName: "ref_seminar_mhs",
        modelName: "SeminarMhs",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxSeminarMhs.hasMany(SeminarMhs, {
    as: "dospem_tasis_mhs",
    foreignKey: "id_trx_seminar"
});

SeminarMhs.belongsTo(TrxSeminarMhs, {
    as: "seminar_tesis_mhs",
    foreignKey: "id_trx_seminar"
});

SeminarMhs.belongsTo(RefDosepemMhs, {
    as: "dospem_t",
    foreignKey: "id_dospem_mhs"
});

RefDosepemMhs.hasMany(SeminarMhs, {
    as: "t_dospem",
    foreignKey: "id_dospem_mhs"
});

export default SeminarMhs;