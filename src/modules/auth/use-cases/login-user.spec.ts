import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { UserEntity } from "@/modules/users/domain/users.entity.js";
import { UsersInMemoryRepository } from "@/modules/users/infrastructure/fakes/users.in-memory.repo.js";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";
import type { ILogger } from "@/shared/application/ports/ILogger.js";
import type { ITokenService } from "@/shared/application/ports/ITokenService.js";
import { LoginUserUseCase } from "./login-user.js";

describe("Auth - Login user", () => {
  let usersRepo: UsersInMemoryRepository;
  const MockCryptoService = vi.fn(
    class implements ICryptoService {
      randomId = vi.fn().mockReturnValue("2");
      hashPassword = vi.fn().mockResolvedValue("hashed-password");
      comparePassword = vi.fn().mockResolvedValue(true);
    },
  );
  const MockTokenService = vi.fn(
    class implements ITokenService {
      generateToken = vi.fn().mockReturnValue("token");
      generateRefreshToken = vi.fn().mockReturnValue("refresh-token");
      getSession = vi.fn().mockReturnValue({
        userId: "1",
        email: "test@example.com",
        isVerified: true,
        loginDate: new Date(),
      });
      validateRefreshToken = vi.fn().mockReturnValue({ userId: "1" });
    },
  );
  const MockLogger = vi.fn(
    class implements ILogger {
      info = vi.fn();
      error = vi.fn();
      warn = vi.fn();
      debug = vi.fn();
    },
  );
  const cryptoService = new MockCryptoService();
  const tokenService = new MockTokenService();
  const logger = new MockLogger();

  beforeEach(() => {
    usersRepo = new UsersInMemoryRepository();
    usersRepo.save(
      new UserEntity("1", "test@example.com", "password", true, new Date()),
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("should login a user", async () => {
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const generateTokenSpy = vi.spyOn(tokenService, "generateToken");
    const useCase = new LoginUserUseCase(
      usersRepo,
      cryptoService,
      tokenService,
      logger,
    );
    const result = await useCase.execute({
      email: "test@example.com",
      password: "password",
    });
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      token: "token",
      refreshToken: "refresh-token",
    });
  });

  test("should not login a user if the user is not found", async () => {
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const generateTokenSpy = vi.spyOn(tokenService, "generateToken");
    const useCase = new LoginUserUseCase(
      usersRepo,
      cryptoService,
      tokenService,
      logger,
    );
    const result = await useCase.execute({
      email: "test2@example.com",
      password: "password",
    });
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(generateTokenSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      token: null,
      refreshToken: null,
    });
  });

  test("should not login a user if the password is invalid", async () => {
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const generateTokenSpy = vi.spyOn(tokenService, "generateToken");
    const useCase = new LoginUserUseCase(
      usersRepo,
      cryptoService,
      tokenService,
      logger,
    );
    const result = await useCase.execute({
      email: "test@example.com",
      password: "password2",
    });
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(generateTokenSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      token: null,
      refreshToken: null,
    });
  });
});
