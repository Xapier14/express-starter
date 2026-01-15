import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import z from "zod";
import type { UserEntity } from "@/modules/users/domain/users.entity.js";
import type { IConfigService } from "@/shared/application/ports/IConfigService.js";
import type { ILogger } from "@/shared/application/ports/ILogger.js";
import type {
  IRefreshData,
  ISession,
  ITokenService,
} from "@/shared/application/ports/ITokenService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { appContainer } from "../di/Container.js";

const JWTSessionSchema = z.object({
  sub: z.string(),
  email: z.string(),
  isVerified: z.boolean(),
  iat: z.number(),
  exp: z.number(),
});

const JWTRefreshSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
});

@injectable()
export class JwtService implements ITokenService {
  constructor(
    @inject(SharedDomain.IConfigService)
    private readonly configService: IConfigService,
  ) {}

  generateToken(
    user: UserEntity,
    additionalClaims?: Record<string, string | boolean | number>,
  ): string {
    const duration = Number.parseInt(
      this.configService.get("JWT_DURATION"),
      10,
    );
    const secret = this.configService.get("JWT_SECRET");
    const claims = {
      iat: Math.ceil(Date.now() / 1000),
      exp: Math.ceil(Date.now() / 1000) + duration,
      sub: user.id,
      email: user.email,
      isVerified: user.isVerified,
      ...additionalClaims,
    };
    const jwtClaims = JWTSessionSchema.parse(claims);

    const token = jwt.sign(jwtClaims, secret, {
      algorithm: "HS256",
    });
    return token;
  }
  generateRefreshToken(user: UserEntity): string {
    const duration = Number.parseInt(
      this.configService.get("JWT_REFRESH_DURATION"),
      10,
    );
    const secret = this.configService.get("JWT_REFRESH_SECRET");
    const claims = {
      iat: Math.ceil(Date.now() / 1000),
      exp: Math.ceil(Date.now() / 1000) + duration,
      sub: user.id,
    };
    const jwtClaims = JWTRefreshSchema.parse(claims);
    const token = jwt.sign(jwtClaims, secret, {
      algorithm: "HS256",
    });
    return token;
  }
  getSession(token: string): ISession | null {
    const secret = this.configService.get("JWT_SECRET");
    const logger = appContainer.get<ILogger>(SharedDomain.ILogger);
    try {
      const decoded = jwt.verify(token, secret);
      const decodedToken = JWTSessionSchema.parse(decoded);
      if (decodedToken.exp < Date.now() / 1000) {
        logger.error({
          message: "Token expired",
          module: "JwtService",
          error: new Error("Token expired"),
        });
        return null;
      }
      const session = {
        userId: decodedToken.sub,
        email: decodedToken.email,
        isVerified: decodedToken.isVerified,
        loginDate: new Date(decodedToken.iat * 1000),
      };
      return session;
    } catch (error) {
      let errorInstance: Error | undefined;
      if (error instanceof Error) {
        errorInstance = error;
      }
      logger.error({
        message: "Invalid token",
        module: "JwtService",
        error: errorInstance,
      });
      return null;
    }
  }
  validateRefreshToken(refreshToken: string): IRefreshData | null {
    const secret = this.configService.get("JWT_REFRESH_SECRET");
    const logger = appContainer.get<ILogger>(SharedDomain.ILogger);
    try {
      const decoded = jwt.verify(refreshToken, secret);
      const decodedToken = JWTRefreshSchema.parse(decoded);
      if (decodedToken.exp < Date.now() / 1000) {
        logger.error({
          message: "Token expired",
          module: "JwtService",
          error: new Error("Token expired"),
        });
        return null;
      }
      const refreshData = {
        userId: decodedToken.sub,
      };
      return refreshData;
    } catch (error) {
      let errorInstance: Error | undefined;
      if (error instanceof Error) {
        errorInstance = error;
      }
      logger.error({
        message: "Invalid refresh token",
        module: "JwtService",
        error: errorInstance,
      });
      return null;
    }
  }
}
