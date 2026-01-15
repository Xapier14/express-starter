import type { UserEntity } from "@/modules/users/domain/users.entity.js";
import type { ISession } from "@/shared/application/ports/ITokenService.js";

declare module "express-serve-static-core" {
  interface Request {
    session?: ISession;
    currentUser?: UserEntity;
  }
}
