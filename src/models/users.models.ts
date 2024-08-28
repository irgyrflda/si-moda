import db from "@config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface IUsersAttributes {
    nomor_induk: string;
    nama_user: string;
    token: string;
    refresh_token: string;
    token_expired: Date;
    email_google: string | null | undefined;
    email_ecampus: string | null | undefined;
    uc: string | null | undefined;
    uu: string | null | undefined
    created_at: Date | undefined
    update_at: Date | undefined
}

export type UserOutput = Required<IUsersAttributes>;
export type UserInput = Optional<
    IUsersAttributes,
    "nama_user" | "email_google" | "email_ecampus" |
    "uc" | "uu" | "created_at" | "update_at"
>;

class Users
    extends Model<IUsersAttributes, UserInput>
    implements IUsersAttributes {
    declare nomor_induk: string;
    declare nama_user: string;
    declare token: string;
    declare refresh_token: string;
    declare token_expired: Date;
    declare email_google: string | null | undefined;
    declare email_ecampus: string | null | undefined;
    declare uc: string | null | undefined;
    declare uu: string | null | undefined
    declare created_at: Date | undefined
    declare update_at: Date | undefined
}

Users.init(
    {
        nomor_induk: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false
        },
        nama_user: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        token_expired: {
            type: DataTypes.DATE(),
            allowNull: true
        },
        email_google: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        email_ecampus: {
            type: DataTypes.STRING(100),
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
        tableName: "ref_user",
        modelName: "Users",
        underscored: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

export default Users;