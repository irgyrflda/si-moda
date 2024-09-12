import db from "@config/database";
import { DataTypes, HasMany, Model, Optional } from "sequelize";
import TrxBimbinganMhs from "./trx-bimbingan-mhs.models";
import RefDosepemMhs from "./ref-dospem-mhs.models";

export enum status_persetujuan_dospem_mhs {
    setuju = "setuju",
    belumDisetujui = "belum disetujui",
    tidak_setuju = "tidak setuju"
}

interface IBimbinganMhsAttributes {
    id_bimbingan: number | null | undefined;
    id_trx_bimbingan: number | null | undefined;
    id_dospem_mhs: number | null | undefined;
    status_persetujuan: status_persetujuan_dospem_mhs;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type BimbinganMhsOutput = Required<IBimbinganMhsAttributes>;
export type BimbinganMhsInput = Optional<
    IBimbinganMhsAttributes,
    "id_bimbingan" | "status_persetujuan" | "uc" | "uu" | "created_at" | "update_at"
>;

class BimbinganMhs
    extends Model<IBimbinganMhsAttributes, BimbinganMhsInput>
    implements IBimbinganMhsAttributes {
    declare id_bimbingan: number | null | undefined;
    declare id_trx_bimbingan: number;
    declare id_dospem_mhs: number;
    declare status_persetujuan: status_persetujuan_dospem_mhs;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

BimbinganMhs.init(
    {
        id_bimbingan: {
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
        status_persetujuan: {
            type: DataTypes.ENUM("setuju", "belum disetujui", "tidak setuju"),
            defaultValue: "belum disetujui",
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
        tableName: "ref_bimbingan_mhs",
        modelName: "BimbinganMhs",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

TrxBimbinganMhs.hasMany(BimbinganMhs, {
    as: "dospem_tasis_mhs",
    foreignKey: "id_trx_bimbingan"
});

BimbinganMhs.belongsTo(TrxBimbinganMhs, {
    as: "bimbingan_tesis_mhs",
    foreignKey: "id_trx_bimbingan"
});

BimbinganMhs.hasMany(RefDosepemMhs, {
    as: "dospem_tesis",
    foreignKey: "id_dospem_mhs"
});

RefDosepemMhs.belongsTo(BimbinganMhs, {
    as: "tesis_dospem",
    foreignKey: "id_dospem_mhs"
});

export default BimbinganMhs;