import { inject, injectable } from "inversify";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import type { IUseCase } from "@/shared/core/IUseCase.js";
import { UserEntity } from "../domain/users.entity.js";
import type { IUsersRepository } from "../domain/users.repo.js";
import { UsersDomain } from "../domain/users.symbols.js";

export type RegisterUserDTO = {
  email: string;
  password: string;
  isVerified?: boolean;
};

@injectable()
export class RegisterUserUseCase implements IUseCase<RegisterUserDTO> {
  constructor(
    @inject(UsersDomain.IUserRepository)
    private readonly userRepo: IUsersRepository,
    @inject(SharedDomain.ICryptoService)
    private readonly cryptoService: ICryptoService,
  ) {}

  async execute(inputDto: RegisterUserDTO): Promise<void> {
    const user = await this.userRepo.findOne({ email: inputDto.email });
    if (user) {
      throw new Error("User already exists");
    }
    const hashedPassword = await this.cryptoService.hashPassword(
      inputDto.password,
    );
    const newUser = new UserEntity(
      this.userRepo.generateId(),
      inputDto.email,
      hashedPassword,
      inputDto.isVerified ?? false,
      new Date(),
    );
    await this.userRepo.save(newUser);
  }
}
