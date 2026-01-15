import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import type { ILogger } from "@/shared/application/ports/ILogger.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { ValidationError } from "@/shared/core/errors/ValidationError.js";
import { appContainer } from "../../di/Container.js";

export const zodValidationHandler = (
  err: ZodError,
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const logger = appContainer.get<ILogger>(SharedDomain.ILogger, {
    optional: true,
  });
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path[0]?.toString() ?? "root",
      message: issue.message,
    }));
    const validationError = new ValidationError("Validation error", issues);
    logger?.error({
      message: "ZodError caught!",
      module: "zodValidationHandler",
      context: {
        route: req.originalUrl,
        method: req.method,
        userAgent: req.headers["user-agent"] ?? "n/a",
        ip: req.ip ?? "n/a",
      },
      error: validationError,
    });
    next(validationError);
  }

  next(err);
};
