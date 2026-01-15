import { ContainerModule } from "inversify";
import { LoginUserUseCase } from "../../use-cases/login-user.js";
import { RefreshSessionUseCase } from "../../use-cases/refresh-session.js";
import { UserSignupUseCase } from "../../use-cases/user-signup.js";

export const AuthDIModule = new ContainerModule(({ bind }) => {
  bind(LoginUserUseCase).toSelf().inTransientScope();
  bind(RefreshSessionUseCase).toSelf().inTransientScope();
  bind(UserSignupUseCase).toSelf().inTransientScope();
});
