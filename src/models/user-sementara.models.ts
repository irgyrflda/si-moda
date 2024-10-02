import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IRefUserSementaraAttributes {
    email: string,
    token: string,
    refresh_token: string,
    password: string;
}

export type RefUserSementaraOutput = Required<IRefUserSementaraAttributes>;
export type RefUserSementaraInput = Required<IRefUserSementaraAttributes>;

class RefUserSementara
    extends Model<IRefUserSementaraAttributes, RefUserSementaraInput>
    implements IRefUserSementaraAttributes {
    declare email: string;
    declare token: string;
    declare refresh_token: string;
    declare password: string;
}

RefUserSementara.init(
    {
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: "ref_user_sementara",
        modelName: "RefGroupUser",
        underscored: true,
        createdAt: false,
        updatedAt: false
    }
);

export default RefUserSementara;