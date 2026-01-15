import { Container } from "inversify";
import { AuthDIModule } from "@/modules/auth/infrastructure/di/auth.di.js";
import { UsersDIModule } from "@/modules/users/infrastructure/di/users.di.js";
import { SharedDIModule } from "./shared.di.js";

const appContainer = new Container();

appContainer.load(SharedDIModule);
appContainer.load(AuthDIModule);
appContainer.load(UsersDIModule);

export { appContainer };
