import { ContainerModule } from "inversify";
import type { IUsersRepository } from "../../domain/users.repo.js";
import type { IUsersService } from "../../domain/users.service.js";
import { UsersService } from "../../domain/users.service.js";
import { UsersDomain } from "../../domain/users.symbols.js";
import { RegisterUserUseCase } from "../../use-cases/register-user.js";
import { UsersPrismaRepository } from "../persistence/users.prisma.repo.js";

export const UsersDIModule = new ContainerModule(({ bind }) => {
  bind<IUsersRepository>(UsersDomain.IUserRepository).to(UsersPrismaRepository);
  bind<IUsersService>(UsersDomain.IUserService).to(UsersService);

  bind(RegisterUserUseCase).toSelf().inTransientScope();
});
