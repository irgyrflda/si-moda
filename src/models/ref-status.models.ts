import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IStatusAttributes {
    kode_status: string;
    keterangan_status: string;
    kategori_status: string;
}

export type StatusOutput = Required<IStatusAttributes>;
export type StatusInput = Required<IStatusAttributes>;

class Status
    extends Model<IStatusAttributes, StatusInput>
    implements IStatusAttributes {
    declare kode_status: string;
    declare keterangan_status: string;
    declare kategori_status: string;
}

Status.init(
    {
        kode_status: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        keterangan_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        kategori_status: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: db,
        tableName: "ref_status",
        modelName: "Status",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

export default Status;