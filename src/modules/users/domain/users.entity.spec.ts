import { describe, expect, test, vi } from "vitest";
import { InvalidEmailFormat } from "./errors/InvalidEmailFormat.js";
import { InvalidPassword } from "./errors/InvalidPassword.js";
import { NewPasswordMustBeDifferent } from "./errors/NewPasswordMustBeDifferent.js";
import { UserEntity } from "./users.entity.js";

describe("Users - UserEntity", () => {
  test("should create a user entity", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    expect(user).toBeDefined();
    expect(user.id).toBe("1");
    expect(user.email).toBe("test@example.com");
    expect(user.password).toBe("password");
    expect(user.isVerified).toBe(false);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  test("should throw an error if the email is invalid", () => {
    expect(() => {
      new UserEntity("1", "test", "password", false, new Date());
    }).toThrowError(InvalidEmailFormat);
  });

  test("should throw an error if the password is invalid", () => {
    expect(() => {
      new UserEntity("1", "test@example.com", "", false, new Date());
    }).toThrowError(InvalidPassword);
  });

  test("should get account age in seconds", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2000, 1, 1, 13, 0, 0));
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    // advance time by 5 seconds
    vi.setSystemTime(new Date(2000, 1, 1, 13, 0, 5));
    expect(user.getAccountAge()).toBe(5);
    vi.useRealTimers();
  });

  test("should change email successfully", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    user.changeEmail("test2@example.com");
    expect(user.email).toBe("test2@example.com");
  });

  test("should throw an error if the new email is invalid", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    expect(() => {
      user.changeEmail("test");
    }).toThrowError(InvalidEmailFormat);
  });

  test("should change password successfully", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    user.changePassword("password2");
    expect(user.password).toBe("password2");
  });

  test("should throw an error if the new password is the same as the old password", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    expect(() => {
      user.changePassword("password");
    }).toThrowError(NewPasswordMustBeDifferent);
  });

  test("should throw an error if the new password is invalid", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    expect(() => {
      user.changePassword("");
    }).toThrowError(InvalidPassword);
  });

  test("should set verified status successfully", () => {
    const user = new UserEntity(
      "1",
      "test@example.com",
      "password",
      false,
      new Date(),
    );
    user.setVerifiedStatus(true);
    expect(user.isVerified).toBe(true);
  });
});
