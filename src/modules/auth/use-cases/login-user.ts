import { inject, injectable, optional } from "inversify";
import type { IUsersRepository } from "@/modules/users/domain/users.repo.js";
import { UsersDomain } from "@/modules/users/domain/users.symbols.js";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";
import type {
  ILogger,
  IRequestContext,
} from "@/shared/application/ports/ILogger.js";
import type { ITokenService } from "@/shared/application/ports/ITokenService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import type { IUseCase } from "@/shared/core/IUseCase.js";

export type LoginUserDTO = {
  email: string;
  password: string;
};
export type LoginUserResult = {
  token: string | null;
  refreshToken: string | null;
};

@injectable()
export class LoginUserUseCase
  implements IUseCase<LoginUserDTO, LoginUserResult>
{
  constructor(
    @inject(UsersDomain.IUserRepository)
    private readonly userRepository: IUsersRepository,
    @inject(SharedDomain.ICryptoService)
    private readonly cryptoService: ICryptoService,
    @inject(SharedDomain.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(SharedDomain.ILogger)
    private readonly logger: ILogger,
    @inject(SharedDomain.IRequestContext)
    @optional()
    private readonly requestContext?: IRequestContext,
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginUserResult> {
    const user = await this.userRepository.findOne({ email: dto.email });
    if (!user) {
      this.logger.error({
        message: "Invalid credentials",
        module: "LoginUserUseCase",
        context: this.requestContext,
      });
      return { token: null, refreshToken: null };
    }
    const isPasswordValid = await this.cryptoService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.error({
        message: "Invalid credentials",
        module: "LoginUserUseCase",
        context: this.requestContext,
      });
      return { token: null, refreshToken: null };
    }
    const token = this.tokenService.generateToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);
    this.logger.info({
      message: "User logged in",
      module: "LoginUserUseCase",
      context: this.requestContext,
    });
    return { token, refreshToken };
  }
}
