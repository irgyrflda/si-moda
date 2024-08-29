import getConfig from '@config/dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import CustomError from './error-handler';
import { httpCode } from '@utils/prefix';
import { debugLogger, errorLogger } from '@config/logger';
import Users from '@models/users.models';
import { Op } from 'sequelize';
import RefUserSementara from '@models/user-sementara.models';

const generateAccessToken = (email: string) => {
    return jwt.sign({ email: email }, getConfig("SESSION_KEY"), {
        expiresIn: "1h"
    });
};

const generateRefreshToken = (email: string) => {
    const refreshToken = jwt.sign({ email: email }, getConfig("SESSION_REFRESH_KEY"), {
        expiresIn: "7d"
    });

    return refreshToken;
};

const checkToken = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const emailUser = req.headers.email

        const getDataUser: any = await Users.findOne({
            attributes: ["token"],
            where: {
                [Op.or]: {
                    email_ecampus: emailUser,
                    email_google: emailUser
                }
            }
        })
        if (!getDataUser) {
            throw new CustomError(httpCode.badRequest, "Unauthorized[0] User tidak ditemukan")
        }
        const tokenUser: string | null | undefined = getDataUser.token
        if (token !== tokenUser) {
            throw new CustomError(httpCode.unauthorized, "Unauthorized token not match[0] ")
        }

        if (!token || !emailUser) {
            throw new CustomError(httpCode.unauthorized, "Unauthorized[0]")
        }

        try {
            const verified = jwt.verify(token, getConfig("SESSION_KEY")) as JwtPayload;
            if (verified.email !== emailUser) {
                throw new CustomError(httpCode.unauthorized, "Unauthorized token not match[1]")
            }
            console.log(verified);

            (req as any).user = verified;
            next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new CustomError(httpCode.unauthorized, "Token Expired")
            }
            throw new CustomError(httpCode.unauthorized, "Unauthorized[2]")
        }
    } catch (error) {
        errorLogger.error("Error chect token : ", error)
        next(error);
    }
};

const checkTokenSementara = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const emailUser = req.headers.email

        if (!token || !emailUser) {
            throw new CustomError(httpCode.unauthorized, "Unauthorized[0]")
        }

        const getDataUser: any = await RefUserSementara.findOne({
            attributes: ["token", "refresh_token"],
            where: {
                email: emailUser
            }
        })
        if (!getDataUser) {
            throw new CustomError(httpCode.badRequest, "Unauthorized[0] User tidak ditemukan")
        }

        const tokenUser: string | null | undefined = getDataUser.token
        req.headers.token = getDataUser.token;
        req.headers.refresh_token = getDataUser.refresh_token;

        try {
            const verified = jwt.verify(token, getConfig("SESSION_KEY")) as JwtPayload;
            if (verified.email !== emailUser) {
                throw new CustomError(httpCode.unauthorized, "Unauthorized token not match[0]")
            }
            if (token !== tokenUser) {
                throw new CustomError(httpCode.unauthorized, "Unauthorized token not match[1]")
            }
            console.log(verified);

            (req as any).user = verified;
            next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new CustomError(httpCode.unauthorized, "Token Expired")
            }
            throw new CustomError(httpCode.unauthorized, "Unauthorized[2] " + err)
        }
    } catch (error) {
        errorLogger.error("Error chect token : ", error)
        next(error);
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    checkToken,
    checkTokenSementara
}