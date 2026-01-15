import { InvalidEmailFormat } from "./errors/InvalidEmailFormat.js";
import { InvalidPassword } from "./errors/InvalidPassword.js";
import { NewPasswordMustBeDifferent } from "./errors/NewPasswordMustBeDifferent.js";

export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public isVerified: boolean,
    public createdAt: Date,
  ) {
    if (!email.includes("@")) {
      throw new InvalidEmailFormat();
    }
    if (password.length === 0) {
      throw new InvalidPassword();
    }
  }

  /**
   * Returns the age of the account in seconds
   * @returns account age in seconds
   */
  getAccountAge() {
    return (Date.now() - this.createdAt.getTime()) / 1000;
  }

  changeEmail(newEmail: string) {
    if (!newEmail.includes("@")) {
      throw new InvalidEmailFormat();
    }
    this.email = newEmail;
  }

  changePassword(newHashedPassword: string) {
    if (this.password === newHashedPassword) {
      throw new NewPasswordMustBeDifferent();
    }
    if (newHashedPassword.length === 0) {
      throw new InvalidPassword();
    }
    this.password = newHashedPassword;
  }

  setVerifiedStatus(verifiedStatus: boolean) {
    this.isVerified = verifiedStatus;
  }
}
