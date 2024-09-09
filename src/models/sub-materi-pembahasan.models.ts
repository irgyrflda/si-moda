import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import MateriPembahasan from "./materi-pembahasan.models";

export enum status_sub_materi {
    optional = "optional",
    required = "required"
}

interface ISubMateriPembahasanAttributes {
    id_sub_materi_pembahasan: number | null | undefined;
    id_materi_pembahasan: number;
    sub_materi_pembahasan: string;
    status_sub_materi: status_sub_materi;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type SubMateriPembahasanOutput = Required<ISubMateriPembahasanAttributes>;
export type SubMateriPembahasanInput = Optional<
    ISubMateriPembahasanAttributes,
    "id_sub_materi_pembahasan" | "uc" | "uu" | "created_at" | "update_at"
>;

class SubMateriPembahasan
    extends Model<ISubMateriPembahasanAttributes, SubMateriPembahasanInput>
    implements ISubMateriPembahasanAttributes {
    declare id_sub_materi_pembahasan: number | null | undefined;
    declare id_materi_pembahasan: number;
    declare sub_materi_pembahasan: string;
    declare status_sub_materi: status_sub_materi;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

SubMateriPembahasan.init(
    {
        id_sub_materi_pembahasan: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_materi_pembahasan: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        sub_materi_pembahasan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status_sub_materi: {
            type: DataTypes.ENUM("optional", "required"),
            defaultValue: "required",
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
        tableName: "ref_sub_materi_pembahasan",
        modelName: "SubMateriPembahasan",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

SubMateriPembahasan.hasMany(MateriPembahasan, {
    as: "materi",
    foreignKey: "id_materi_pembahasan"
});

MateriPembahasan.belongsTo(SubMateriPembahasan, {
    as: "sub_materi",
    foreignKey: "id_materi_pembahasan"
});

export default SubMateriPembahasan;