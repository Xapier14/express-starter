type Issue = {
  field: string;
  message: string;
};

export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: Issue[],
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
