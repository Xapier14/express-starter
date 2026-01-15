import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { UserEntity } from "@/modules/users/domain/users.entity.js";
import { UsersInMemoryRepository } from "@/modules/users/infrastructure/fakes/users.in-memory.repo.js";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";
import { UserSignupUseCase } from "./user-signup.js";

describe("Auth - User signup", () => {
  let usersRepo: UsersInMemoryRepository;
  const MockCryptoService = vi.fn(
    class implements ICryptoService {
      randomId = vi.fn().mockReturnValue("1");
      hashPassword = vi.fn().mockResolvedValue("hashed-password");
      comparePassword = vi.fn().mockResolvedValue(true);
    },
  );
  const cryptoService: ICryptoService = new MockCryptoService();
  let useCase: UserSignupUseCase;

  beforeEach(() => {
    usersRepo = new UsersInMemoryRepository();
    useCase = new UserSignupUseCase(usersRepo, cryptoService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("should signup a user", async () => {
    const saveSpy = vi.spyOn(usersRepo, "save");
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const result = await useCase.execute({
      email: "test@example.com",
      password: "password",
    });
    expect(cryptoService.randomId).toHaveBeenCalledTimes(1);
    expect(cryptoService.hashPassword).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
    expect(
      (
        await usersRepo.findAll({
          email: "test@example.com",
        })
      ).data,
    ).toHaveLength(1);
    expect(
      (
        await usersRepo.findAll({
          email: "test@example.com",
        })
      ).data,
    ).toHaveLength(1);
  });

  test("should throw an error if the user already exists", async () => {
    // setup
    await usersRepo.save(
      new UserEntity(
        "1",
        "test@example.com",
        "hashed-password",
        true,
        new Date(),
      ),
    );
    // act
    await expect(
      useCase.execute({
        email: "test@example.com",
        password: "password",
      }),
    ).rejects.toThrow("User already exists");
  });
});
