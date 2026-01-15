import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { UserEntity } from "@/modules/users/domain/users.entity.js";
import { UsersInMemoryRepository } from "@/modules/users/infrastructure/fakes/users.in-memory.repo.js";
import type { ILogger } from "@/shared/application/ports/ILogger.js";
import type { ITokenService } from "@/shared/application/ports/ITokenService.js";
import { RefreshSessionUseCase } from "./refresh-session.js";

describe("Auth - Refresh session", () => {
  let usersRepo: UsersInMemoryRepository;
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
      validateRefreshToken = vi.fn((refreshToken) => {
        if (refreshToken === "refresh-token") {
          return { userId: "1" };
        }
        if (refreshToken === "non-existant-user") {
          return { userId: "2" };
        }
        return null;
      });
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

  test("should refresh a session", async () => {
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const generateTokenSpy = vi.spyOn(tokenService, "generateToken");
    const useCase = new RefreshSessionUseCase(usersRepo, tokenService, logger);
    const result = await useCase.execute({
      refreshToken: "refresh-token",
    });
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      token: "token",
      refreshToken: "refresh-token",
    });
  });

  test("should not refresh when refresh token is invalid", async () => {
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const generateTokenSpy = vi.spyOn(tokenService, "generateToken");
    const useCase = new RefreshSessionUseCase(usersRepo, tokenService, logger);
    const result = await useCase.execute({
      refreshToken: "invalid-refresh-token",
    });
    expect(findOneSpy).toHaveBeenCalledTimes(0);
    expect(generateTokenSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      token: null,
      refreshToken: null,
    });
  });

  test("should not refresh when user id does not exist", async () => {
    const findOneSpy = vi.spyOn(usersRepo, "findOne");
    const generateTokenSpy = vi.spyOn(tokenService, "generateToken");
    const useCase = new RefreshSessionUseCase(usersRepo, tokenService, logger);
    const result = await useCase.execute({
      refreshToken: "non-existant-user",
    });
    expect(findOneSpy).toHaveBeenCalledTimes(1);
    expect(generateTokenSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      token: null,
      refreshToken: null,
    });
  });
});
