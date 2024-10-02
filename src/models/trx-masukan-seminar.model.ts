import db from "@config/database";
import { DataTypes, HasMany, Model, Optional } from "sequelize";
import RefDosepemMhs from "./ref-dospem-mhs.models";
import TrxBimbinganMhs from "./trx-bimbingan-mhs.models";
import TrxSeminarMhs from "./trx-seminar-mhs.models";

interface ITrxMasukanSeminarAttributes {
    id_trx_masukan_seminar: number | null | undefined;
    id_trx_seminar: number;
    id_dospem_mhs: number;
    masukan: string;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type TrxMasukanSeminarOutput = Required<ITrxMasukanSeminarAttributes>;
export type TrxMasukanSeminarInput = Optional<
    ITrxMasukanSeminarAttributes,
    "id_trx_masukan_seminar" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxMasukanSeminar
    extends Model<ITrxMasukanSeminarAttributes, TrxMasukanSeminarInput>
    implements ITrxMasukanSeminarAttributes {
    declare id_trx_masukan_seminar: number | null | undefined;
    declare id_trx_seminar: number;
    declare id_dospem_mhs: number;
    declare masukan: string;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxMasukanSeminar.init(
    {
        id_trx_masukan_seminar: {
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
        masukan: {
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
        tableName: "trx_masukan_seminar",
        modelName: "TrxMasukanSeminar",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxMasukanSeminar.hasMany(TrxSeminarMhs, {
    as: "masukan_seminar",
    foreignKey: "id_trx_seminar"
});

TrxSeminarMhs.belongsTo(TrxMasukanSeminar, {
    as: "masukan_dospem",
    foreignKey: "id_trx_seminar"
});

TrxMasukanSeminar.hasMany(RefDosepemMhs, {
    as: "dospem_tesis",
    foreignKey: "id_dospem_mhs"
});

RefDosepemMhs.belongsTo(TrxMasukanSeminar, {
    as: "masukan_dospem",
    foreignKey: "id_dospem_mhs"
});

export default TrxMasukanSeminar;