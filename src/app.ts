import cookieParser from "cookie-parser";
import express from "express";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import type { Container } from "inversify";
import type { IConfigService } from "@/shared/application/ports/IConfigService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { appContainer } from "@/shared/infrastructure/di/Container.js";
import { errorHandler } from "@/shared/infrastructure/http/error-handlers/catchAll.js";
import { requestLogger } from "@/shared/infrastructure/http/middlewares/requestLogger.js";
import { stripHeaders } from "@/shared/infrastructure/http/middlewares/stripHeaders.js";
import baseRoutes from "@/shared/infrastructure/http/routes.js";
import { ConsoleLogger } from "@/shared/infrastructure/logger/ConsoleLogger.js";
import { PrismaClientWrapper } from "@/shared/infrastructure/persistence/prisma/PrismaClientWrapper.js";
import { swaggerSpec } from "@/swagger.js";
import type { ILogger } from "./shared/application/ports/ILogger.js";
import { zodValidationHandler } from "./shared/infrastructure/http/error-handlers/zodValidation.js";

function bootstrap() {
  // DI setup
  configure(appContainer);
  const configService = appContainer.get<IConfigService>(
    SharedDomain.IConfigService,
  );
  const logger = appContainer.get<ILogger>(SharedDomain.ILogger);

  // web server setup
  const app = express();
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(stripHeaders);
  app.use(express.json());
  app.use(baseRoutes);
  app.use(zodValidationHandler);
  app.use(errorHandler);

  if (configService.isDevelopment()) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info({
      message: "Serving Swagger docs at /docs",
    });
  }
  return app;
}

function configure(appContainer: Container) {
  appContainer.bind(PrismaClientWrapper).toSelf().inSingletonScope();
  appContainer.bind(SharedDomain.ILogger).to(ConsoleLogger).inSingletonScope();
}

// run the app
bootstrap().listen(3000, () => {
  const logger = appContainer.get<ILogger>(SharedDomain.ILogger);
  logger.info({
    message: "Server running on port 3000",
  });
});
