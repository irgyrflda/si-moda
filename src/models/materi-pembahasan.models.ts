import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IMateriPembahasanAttributes {
    id_materi_pembahasan: number | null | undefined;
    materi_pembahasan: string;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type MateriPembahasanOutput = Required<IMateriPembahasanAttributes>;
export type MateriPembahasanInput = Optional<
    IMateriPembahasanAttributes,
    "id_materi_pembahasan" | "uc" | "uu" | "created_at" | "update_at"
>;

class MateriPembahasan
    extends Model<IMateriPembahasanAttributes, MateriPembahasanInput>
    implements IMateriPembahasanAttributes {
    declare id_materi_pembahasan: number | null | undefined;
    declare materi_pembahasan: string;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

MateriPembahasan.init(
    {
        id_materi_pembahasan: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        materi_pembahasan: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: "ref_materi_pembahasan",
        modelName: "MateriPembahasan",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

export default MateriPembahasan;