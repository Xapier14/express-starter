import { inject, injectable, optional } from "inversify";
import type { IUsersRepository } from "@/modules/users/domain/users.repo.js";
import { UsersDomain } from "@/modules/users/domain/users.symbols.js";
import type {
  ILogger,
  IRequestContext,
} from "@/shared/application/ports/ILogger.js";
import type { ITokenService } from "@/shared/application/ports/ITokenService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import type { IUseCase } from "@/shared/core/IUseCase.js";

export type RefreshSessionDTO = {
  refreshToken: string;
};
export type RefreshSessionResult = {
  token: string | null;
  refreshToken: string | null;
};

@injectable()
export class RefreshSessionUseCase
  implements IUseCase<RefreshSessionDTO, RefreshSessionResult>
{
  constructor(
    @inject(UsersDomain.IUserRepository)
    private readonly userRepository: IUsersRepository,
    @inject(SharedDomain.ITokenService)
    private readonly tokenService: ITokenService,
    @inject(SharedDomain.ILogger)
    private readonly logger: ILogger,
    @inject(SharedDomain.IRequestContext)
    @optional()
    private readonly requestContext?: IRequestContext,
  ) {}

  async execute(dto: RefreshSessionDTO): Promise<RefreshSessionResult> {
    const refreshData = this.tokenService.validateRefreshToken(
      dto.refreshToken,
    );
    if (!refreshData?.userId) {
      this.logger.error({
        message: "Invalid refresh token",
        module: "RefreshSessionUseCase",
        context: this.requestContext,
      });
      return { token: null, refreshToken: null };
    }
    const user = await this.userRepository.findOne({ id: refreshData.userId });
    if (!user) {
      this.logger.error({
        message: "Invalid refresh token",
        module: "RefreshSessionUseCase",
        context: this.requestContext,
      });
      return { token: null, refreshToken: null };
    }
    const token = this.tokenService.generateToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);
    this.logger.info({
      message: "Session refreshed",
      module: "RefreshSessionUseCase",
      context: this.requestContext,
    });
    return { token, refreshToken };
  }
}
