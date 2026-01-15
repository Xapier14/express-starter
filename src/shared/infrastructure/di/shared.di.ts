import { ContainerModule } from "inversify";
import type { IConfigService } from "@/shared/application/ports/IConfigService.js";
import type { ICryptoService } from "@/shared/application/ports/ICryptoService.js";
import type { ITokenService } from "@/shared/application/ports/ITokenService.js";
import { SharedDomain } from "@/shared/application/ports/shared.symbols.js";
import { EnvConfigService } from "../config/EnvConfigService.js";
import { BcryptService } from "../crypto/BcryptService.js";
import { JwtService } from "../crypto/JwtService.js";

export const SharedDIModule = new ContainerModule(({ bind }) => {
  bind<ICryptoService>(SharedDomain.ICryptoService).to(BcryptService);
  bind<ITokenService>(SharedDomain.ITokenService).to(JwtService);
  bind<IConfigService>(SharedDomain.IConfigService).to(EnvConfigService);
});
