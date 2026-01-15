import type { NextFunction, Request, Response } from "express";

const HEADERS_TO_STRIP = ["x-powered-by"];

export const stripHeaders = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  HEADERS_TO_STRIP.forEach((header) => {
    res.removeHeader(header);
  });
  next();
};
