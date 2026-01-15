import type { Response } from "express";

export type GenericErrorResponse = {
  message: string;
};

type RespondWithGenericErrorParams = {
  res: Response;
  response: GenericErrorResponse;
  statusCode: number;
};
export function respondWithGenericError({
  res,
  response,
  statusCode,
}: RespondWithGenericErrorParams) {
  res.status(statusCode).json(response);
}
