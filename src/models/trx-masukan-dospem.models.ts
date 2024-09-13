import db from "@config/database";
import { DataTypes, HasMany, Model, Optional } from "sequelize";
import RefDosepemMhs from "./ref-dospem-mhs.models";
import TrxBimbinganMhs from "./trx-bimbingan-mhs.models";

interface ITrxMasukanDsnAttributes {
    id_trx_masukan: number | null | undefined;
    id_trx_bimbingan: number;
    id_dospem_mhs: number;
    masukan: string;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type TrxMasukanDsnOutput = Required<ITrxMasukanDsnAttributes>;
export type TrxMasukanDsnInput = Optional<
    ITrxMasukanDsnAttributes,
    "id_trx_masukan" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxMasukanDsn
    extends Model<ITrxMasukanDsnAttributes, TrxMasukanDsnInput>
    implements ITrxMasukanDsnAttributes {
    declare id_trx_masukan: number | null | undefined;
    declare id_trx_bimbingan: number;
    declare id_dospem_mhs: number;
    declare masukan: string;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxMasukanDsn.init(
    {
        id_trx_masukan: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_trx_bimbingan: {
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
        tableName: "trx_masukan_dospem",
        modelName: "TrxMasukanDsn",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxMasukanDsn.hasMany(TrxBimbinganMhs, {
    as: "masukan_dospem",
    foreignKey: "id_trx_bimbingan"
});

TrxBimbinganMhs.belongsTo(TrxMasukanDsn, {
    as: "masukan_dospem",
    foreignKey: "id_trx_bimbingans"
});

TrxMasukanDsn.hasMany(RefDosepemMhs, {
    as: "dospem_tesis",
    foreignKey: "id_dospem_mhs"
});

RefDosepemMhs.belongsTo(TrxMasukanDsn, {
    as: "masukan_dospem",
    foreignKey: "id_dospem_mhs"
});

export default TrxMasukanDsn;