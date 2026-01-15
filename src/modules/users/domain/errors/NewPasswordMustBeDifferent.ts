export class NewPasswordMustBeDifferent extends Error {
  constructor() {
    super("New password must be different from the old password");
  }
}
