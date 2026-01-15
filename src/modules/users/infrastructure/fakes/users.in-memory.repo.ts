import { InMemoryRepository } from "@/shared/infrastructure/persistence/fakes/InMemoryRepository.js";
import type { UserEntity } from "../../domain/users.entity.js";
import type { IUsersRepository } from "../../domain/users.repo.js";

export class UsersInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements IUsersRepository {}
