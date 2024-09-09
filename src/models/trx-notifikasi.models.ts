import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface ITrxNotifikasiAttributes {
    id_notif: number | null | undefined;
    nomor_induk: string;
    isi_notif: string;
    status_notif: string | null | undefined;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type TrxNotifikasiOutput = Required<ITrxNotifikasiAttributes>;
export type TrxNotifikasiInput = Optional<
    ITrxNotifikasiAttributes,
    "id_notif" | "status_notif" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxNotifikasi
    extends Model<ITrxNotifikasiAttributes, TrxNotifikasiInput>
    implements ITrxNotifikasiAttributes {
    declare id_notif: number | null | undefined;
    declare nomor_induk: string;
    declare isi_notif: string;
    declare status_notif: string | null | undefined;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxNotifikasi.init(
    {
        id_notif: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true
        },
        nomor_induk: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isi_notif: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status_notif: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "1"
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
        tableName: "trx_notifikasi",
        modelName: "RefGroupUser",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

export default TrxNotifikasi;