import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";
import Users from "./users.models";
import RefTersisMhs from "./ref-tesis-mhs.models";

interface ITrxTopikAttributes {
    nomor_induk: string;
    id_topik: number | null | undefined;
    topik_penelitian: string;
    uc: string | null | undefined;
    uu: string | null | undefined;
    created_at: Date | undefined;
    update_at: Date | undefined;
}

export type TrxTopikOutput = Required<ITrxTopikAttributes>;
export type TrxTopikInput = Optional<
    ITrxTopikAttributes,
    "id_topik" | "uc" | "uu" | "created_at" | "update_at"
>;

class TrxTopikUser
    extends Model<ITrxTopikAttributes, TrxTopikInput>
    implements ITrxTopikAttributes {
    declare nomor_induk: string;
    declare id_topik: number | null | undefined;
    declare topik_penelitian: string;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined;
    declare created_at: Date | undefined;
    declare update_at: Date | undefined;
}

TrxTopikUser.init(
    {
        id_topik: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomor_induk: {
            type: DataTypes.STRING,
            allowNull: false
        },
        topik_penelitian: {
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
        tableName: "trx_topik_penelitian",
        modelName: "TrxTopikUser",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

Users.hasMany(TrxTopikUser, {
    as: "topik_penelitian",
    foreignKey: "nomor_induk",
});

TrxTopikUser.belongsTo(Users, {
    as: "user_topik",
    foreignKey: "nomor_induk"
});

RefTersisMhs.hasMany(TrxTopikUser, {
    as: "topik_mhs",
    foreignKey: "nomor_induk"
});

TrxTopikUser.belongsTo(RefTersisMhs, {
    as: "mhs_topik",
    foreignKey: "nim"
})

export default TrxTopikUser;