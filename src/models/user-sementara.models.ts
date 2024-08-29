import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IRefUserSementaraAttributes {
    email: string,
    token: string,
    refresh_token: string
}

export type RefUserSementaraInput = Required<IRefUserSementaraAttributes>;
export type RefUserSementaraOutput = Required<IRefUserSementaraAttributes>;

class RefUserSementara
    extends Model<IRefUserSementaraAttributes, RefUserSementaraInput>
    implements IRefUserSementaraAttributes {
    declare email: string;
    declare token: string;
    declare refresh_token: string
}

RefUserSementara.init(
    {
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refresh_token: {
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