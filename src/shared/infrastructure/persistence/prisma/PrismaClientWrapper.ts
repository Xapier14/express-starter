import { PrismaPg } from "@prisma/adapter-pg";
import { inject, injectable } from "inversify";
import { uuidv7 } from "uuidv7";
import { PrismaClient as PrismaClientLib } from "@/generated/prisma/client.js";
import type { IConfigService } from "@/shared/application/ports/IConfigService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";

export type PrismaClient = PrismaClientLib;

@injectable()
export class PrismaClientWrapper {
  private readonly client: PrismaClientLib;

  constructor(
    @inject(SharedDomain.IConfigService)
    private readonly configService: IConfigService,
  ) {
    const connectionString = this.configService.get("POSTGRES_URL");

    const adapter = new PrismaPg({
      connectionString,
    });

    this.client = new PrismaClientLib({
      adapter,
    });
  }

  getClient(): PrismaClientLib {
    return this.client;
  }

  generateId(): string {
    return uuidv7();
  }
}
