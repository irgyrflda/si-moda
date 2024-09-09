import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import RefDosepem from "./ref-dospem.models";
import RefTersisMhs from "./ref-tesis-mhs.models";

export enum keterangan_dospem {
    dospem_1 = "dospem 1",
    dospem_2 = "dospem 2"
}

export enum status_persetujuan_dospem_mhs {
    setuju = "setuju",
    belum = "belum disetujui",
    tidak = "tidak setuju"
}

interface IRefDospemMhsAttributes {
    id_dospem_mhs: number | null | undefined;
    nidn: string;
    nim: string;
    keterangan_dospem: keterangan_dospem;
    status_persetujuan: status_persetujuan_dospem_mhs;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type RefDospemMhsOutput = Required<IRefDospemMhsAttributes>;
export type RefDospemMhsInput = Optional<
    IRefDospemMhsAttributes,
    "id_dospem_mhs" | "status_persetujuan" | "uc" | "uu" | "created_at" | "update_at"
>;

class RefDosepemMhs
    extends Model<IRefDospemMhsAttributes, RefDospemMhsInput>
    implements IRefDospemMhsAttributes {
    declare id_dospem_mhs: number | null | undefined;
    declare nidn: string;
    declare nim: string;
    declare keterangan_dospem: keterangan_dospem;
    declare status_persetujuan: status_persetujuan_dospem_mhs;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

RefDosepemMhs.init(
    {
        id_dospem_mhs: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nidn: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nim: {
            type: DataTypes.STRING,
            allowNull: false
        },
        keterangan_dospem: {
            type: DataTypes.ENUM("dospem 1", "dospem 2"),
            allowNull: false
        },
        status_persetujuan: {
            type: DataTypes.ENUM("setuju", "belum disetujui", "tidak setuju"),
            defaultValue: "belum disetujui"
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
        tableName: "ref_dospem_mhs",
        modelName: "RefDosepemMhs",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

RefDosepem.hasMany(RefDosepemMhs, {
    as: "mhs_dospem",
    foreignKey: "nidn"
})

RefDosepemMhs.belongsTo(RefDosepem, {
    as: "dosen_mhs",
    foreignKey: "nidn"
})

RefTersisMhs.hasMany(RefDosepemMhs, {
    as: "dospem_mhs_tesis",
    foreignKey: "nim"
})

RefDosepemMhs.belongsTo(RefTersisMhs, {
    as: "tesis_mhs",
    foreignKey: "nim"
})

export default RefDosepemMhs;