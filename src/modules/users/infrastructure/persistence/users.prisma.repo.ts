import { inject, injectable } from "inversify";
import type { User } from "@/generated/prisma/client.js";
import type { UserWhereInput } from "@/generated/prisma/models.js";
import type {
  FilterCriteria,
  PaginationOptions,
  WithPagination,
} from "@/shared/core/IBaseRepository.js";
import {
  type PrismaClient,
  PrismaClientWrapper,
} from "@/shared/infrastructure/persistence/prisma/PrismaClientWrapper.js";
import { UserEntity } from "../../domain/users.entity.js";
import type { IUsersRepository } from "../../domain/users.repo.js";

/** MAPPERS */
export function fromDomain(userEntity: UserEntity): User {
  return {
    id: userEntity.id,
    email: userEntity.email,
    password: userEntity.password,
    isVerified: userEntity.isVerified,
    createdAt: userEntity.createdAt,
  };
}
export function toDomain(userModel: User): UserEntity {
  return new UserEntity(
    userModel.id,
    userModel.email,
    userModel.password,
    userModel.isVerified,
    userModel.createdAt,
  );
}
export function toUserModelFilter(
  criteria: FilterCriteria<UserEntity>,
): FilterCriteria<User> {
  const result: FilterCriteria<User> = {};
  if (criteria.id !== undefined) result.id = criteria.id;
  if (criteria.email !== undefined) result.email = criteria.email;
  if (criteria.password !== undefined) result.password = criteria.password;
  if (criteria.createdAt !== undefined) result.createdAt = criteria.createdAt;
  return result;
}

@injectable()
export class UsersPrismaRepository implements IUsersRepository {
  private readonly prisma: PrismaClient;
  constructor(
    @inject(PrismaClientWrapper)
    private readonly prismaClientWrapper: PrismaClientWrapper,
  ) {
    this.prisma = this.prismaClientWrapper.getClient();
  }

  async findOne(
    criteria: FilterCriteria<UserEntity>,
  ): Promise<UserEntity | null> {
    const where: UserWhereInput = {};
    const modelFilter = toUserModelFilter(criteria);
    if (modelFilter.id) {
      where.id = modelFilter.id;
    }
    if (modelFilter.email) {
      where.email = modelFilter.email;
    }
    const model = await this.prisma.user.findFirst({ where });
    return model ? toDomain(model) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }
  async findAll(
    criteria?: FilterCriteria<UserEntity>,
    paginationOptions?: PaginationOptions,
  ): Promise<WithPagination<UserEntity>> {
    const where: UserWhereInput = {};
    const modelFilter = criteria ? toUserModelFilter(criteria) : {};
    if (modelFilter.id) {
      where.id = modelFilter.id;
    }
    if (modelFilter.email) {
      where.email = modelFilter.email;
    }
    const models = paginationOptions
      ? await this.prisma.user.findMany({
          where,
          take: paginationOptions.limit,
          skip: paginationOptions.offset,
        })
      : await this.prisma.user.findMany({ where });
    const total = await this.prisma.user.count({ where });
    return {
      data: models.map(toDomain),
      total,
    };
  }
  async save(entity: UserEntity): Promise<UserEntity | null> {
    const model = await this.prisma.user.upsert({
      where: { id: entity.id },
      create: fromDomain(entity),
      update: fromDomain(entity),
    });
    return model ? toDomain(model) : null;
  }
  generateId(): string {
    return this.prismaClientWrapper.generateId();
  }
}
