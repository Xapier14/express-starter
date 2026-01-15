import type { NextFunction, Request, Response } from "express";
import type { IUsersRepository } from "@/modules/users/domain/users.repo.js";
import { UsersDomain } from "@/modules/users/domain/users.symbols.js";
import type { ITokenService } from "@/shared/application/ports/ITokenService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { appContainer } from "../../di/Container.js";

export const attachSession = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const tokenService = appContainer.get<ITokenService>(
    SharedDomain.ITokenService,
  );
  const userRepo = appContainer.get<IUsersRepository>(
    UsersDomain.IUserRepository,
  );
  const token = req.cookies.token;
  if (!token) {
    next();
    return;
  }
  const session = tokenService.getSession(token);
  if (!session) {
    next();
    return;
  }
  const currentUser = await userRepo.findOne({ id: session.userId });
  if (!currentUser) {
    next();
    return;
  }
  req.session = session;
  req.currentUser = currentUser;
  next();
};
