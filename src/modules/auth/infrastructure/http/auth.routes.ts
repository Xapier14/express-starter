import { Router } from "express";
import z from "zod";
import type { IConfigService } from "@/shared/application/ports/IConfigService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { appContainer } from "@/shared/infrastructure/di/Container.js";
import { requireAuth } from "@/shared/infrastructure/http/middlewares/requireAuth.js";
import { respondWithGenericError } from "@/shared/infrastructure/http/responses/respondWithGenericError.js";
import { LoginUserUseCase } from "../../use-cases/login-user.js";
import { RefreshSessionUseCase } from "../../use-cases/refresh-session.js";
import { UserSignupUseCase } from "../../use-cases/user-signup.js";

const router = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    LoginRequest:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *          format: password
 */
const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginRequest'
 *    responses:
 *      200:
 *        description: Login successful
 *      401:
 *        description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  const configService = appContainer.get<IConfigService>(
    SharedDomain.IConfigService,
  );
  const { email, password } = LoginRequestSchema.parse(req.body);
  const useCase = appContainer.get(LoginUserUseCase);
  const { token, refreshToken } = await useCase.execute({ email, password });

  if (token && refreshToken) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: !configService.isDevelopment,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !configService.isDevelopment,
      sameSite: "strict",
    });
    res.status(200).send();
  } else {
    respondWithGenericError({
      res,
      response: {
        message: "Invalid credentials",
      },
      statusCode: 401,
    });
  }
});

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterRequest:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *          format: password
 */
const RegisterRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
/**
 * @openapi
 * /auth/register:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Register a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterRequest'
 *    responses:
 *      200:
 *        description: Register successful
 */
router.post("/register", async (req, res) => {
  const { email, password } = RegisterRequestSchema.parse(req.body);
  const useCase = appContainer.get(UserSignupUseCase);
  await useCase.execute({ email, password });
  res.status(200).send();
});

/**
 * @openapi
 * /auth/refresh:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Refresh the current user session
 *    responses:
 *      200:
 *        description: Refresh successful
 */
router.post("/refresh", requireAuth, async (req, res) => {
  const configService = appContainer.get<IConfigService>(
    SharedDomain.IConfigService,
  );
  const useCase = appContainer.get(RefreshSessionUseCase);
  const { token, refreshToken } = await useCase.execute({
    refreshToken: req.cookies.refreshToken,
  });
  if (token && refreshToken) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: !configService.isDevelopment,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !configService.isDevelopment,
      sameSite: "strict",
    });
    res.status(200).send();
  } else {
    respondWithGenericError({
      res,
      response: {
        message: "Invalid refresh token",
      },
      statusCode: 401,
    });
  }
});

/**
 * @openapi
 * /auth/logout:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Logout the current user session
 *    responses:
 *      200:
 *        description: Logout successful
 *      401:
 *        description: Unauthorized
 */
router.post("/logout", requireAuth, async (_req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).send();
});

export default router;
