import type { IConfigService } from "@/shared/application/ports/IConfigService.js";

export class EnvConfigService implements IConfigService {
  get(key: string): string {
    return process.env[key] ?? "";
  }
  isDevelopment(): boolean {
    return (
      process.env.ENVIRONMENT !== "production" ||
      process.env.NODE_ENV === "development"
    );
  }
}
