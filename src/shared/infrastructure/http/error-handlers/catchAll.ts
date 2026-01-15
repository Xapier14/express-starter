import type { ErrorRequestHandler } from "express";
import type { ILogger } from "@/shared/application/ports/ILogger.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { ValidationError } from "@/shared/core/errors/ValidationError.js";
import { appContainer } from "../../di/Container.js";
import { respondWithGenericError } from "../responses/respondWithGenericError.js";
import { respondWithValidationError } from "../responses/respondWithValidationError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const logger = appContainer.get<ILogger>(SharedDomain.ILogger, {
    optional: true,
  });

  logger?.error({
    message: err.message,
    error: err,
    module: "errorHandler",
    context: {
      route: req.originalUrl,
      method: req.method,
      userAgent: req.headers["user-agent"] ?? "n/a",
      ip: req.ip ?? "n/a",
    },
  });

  if (err instanceof ValidationError) {
    respondWithValidationError({
      res,
      response: {
        message: err.message,
        issues: err.issues,
      },
    });
    return;
  }

  respondWithGenericError({
    res,
    response: {
      message: err.message,
    },
    statusCode: 500,
  });
};
