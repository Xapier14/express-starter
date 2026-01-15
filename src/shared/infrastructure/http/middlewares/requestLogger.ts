import type { NextFunction, Request, Response } from "express";
import type { ILogger } from "@/shared/application/ports/ILogger.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { appContainer } from "../../di/Container.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    const logger = appContainer.get<ILogger>(SharedDomain.ILogger);
    logger.info({
      message: res.statusCode.toString(),
      module: "requestLogger",
      context: {
        route: req.originalUrl,
        method: req.method,
        userAgent: req.headers["user-agent"] ?? "n/a",
        ip: req.ip ?? "n/a",
      },
    });
  });

  next();
};
