import type { NextFunction, Request, Response } from "express";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { appContainer } from "@/shared/infrastructure/di/Container.js";

export const attachRequestContext = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  appContainer.bind(SharedDomain.IRequestContext).toConstantValue({
    route: req.originalUrl,
    method: req.method,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });
  next();
  appContainer.unbind(SharedDomain.IRequestContext);
};
