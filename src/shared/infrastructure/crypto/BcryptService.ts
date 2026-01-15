import bcrypt from "bcrypt";
import { uuidv7 } from "uuidv7";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";

export class BcryptService implements ICryptoService {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  randomId(): string {
    return uuidv7();
  }
}
