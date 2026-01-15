import { inject, injectable } from "inversify";
import { UserEntity } from "@/modules/users/domain/users.entity.js";
import type { IUsersRepository } from "@/modules/users/domain/users.repo.js";
import { UsersDomain } from "@/modules/users/domain/users.symbols.js";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import type { IUseCase } from "@/shared/core/IUseCase.js";

export type UserSignupDTO = {
  email: string;
  password: string;
};

@injectable()
export class UserSignupUseCase implements IUseCase<UserSignupDTO> {
  constructor(
    @inject(UsersDomain.IUserRepository)
    private readonly usersRepository: IUsersRepository,
    @inject(SharedDomain.ICryptoService)
    private readonly cryptoService: ICryptoService,
  ) {}

  async execute(dto: UserSignupDTO): Promise<void> {
    const user = await this.usersRepository.findOne({ email: dto.email });
    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = await this.cryptoService.hashPassword(dto.password);
    const userEntity = new UserEntity(
      this.cryptoService.randomId(),
      dto.email,
      hashedPassword,
      false,
      new Date(),
    );
    await this.usersRepository.save(userEntity);
  }
}
