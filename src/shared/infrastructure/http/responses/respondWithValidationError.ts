import type { Response } from "express";

export type ValidationErrorResponse = {
  message: string;
  issues: {
    field: string;
    message: string;
  }[];
};
type RespondWithValidationErrorParams = {
  res: Response;
  response: ValidationErrorResponse;
};
export function respondWithValidationError({
  res,
  response,
}: RespondWithValidationErrorParams) {
  res.status(400).json(response);
}
