import type { IBaseRepository } from "@/shared/core/IBaseRepository.js";
import type { UserEntity } from "./users.entity.js";

export interface IUsersRepository extends IBaseRepository<UserEntity> {}
