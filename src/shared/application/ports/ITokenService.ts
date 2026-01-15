import type { UserEntity } from "@/modules/users/domain/users.entity.js";

export interface ISession {
  userId: string;
  email: string;
  isVerified: boolean;
  loginDate: Date;
}
export interface IRefreshData {
  userId: string;
}

export interface ITokenService {
  generateToken(user: UserEntity): string;
  generateRefreshToken(user: UserEntity): string;
  getSession(token: string): ISession | null;
  validateRefreshToken(refreshToken: string): IRefreshData | null;
}
