/** biome-ignore-all lint/suspicious/noEmptyInterface: This is a placeholder reference file. If your feature does not require a domain service, you can remove this file. */
/** biome-ignore-all lint/correctness/noUnusedPrivateClassMembers: This is a placeholder reference file. If your feature does not require a domain service, you can remove this file. */
import { inject, injectable } from "inversify";
import type { IUsersRepository } from "./users.repo.js";
import { UsersDomain } from "./users.symbols.js";

export interface IUsersService {}

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(UsersDomain.IUserRepository)
    private readonly userRepo: IUsersRepository,
  ) {}
}
