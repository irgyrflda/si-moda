import { httpCode } from "@utils/prefix";
import { NextFunction, Request, Response } from "express";
import { responseSuccess } from "@utils/response-success";

const lists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    responseSuccess(res, httpCode.ok, "web");
  } catch (error) {
    next(error);
  }
};

export default {
  lists,
};
