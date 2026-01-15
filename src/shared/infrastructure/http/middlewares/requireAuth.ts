import type { NextFunction, Request, Response } from "express";
import { respondWithGenericError } from "../responses/respondWithGenericError.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session) {
    return respondWithGenericError({
      res,
      response: {
        message: "Unauthorized",
      },
      statusCode: 401,
    });
  }
  next();
};
