import express from "express";
import authRoutes from "@/modules/auth/infrastructure/http/auth.routes.js";
import helloWorldRoutes from "@/modules/hello-world/infrastructure/http/hello-world.routes.js";
import { attachRequestContext } from "./middlewares/attachRequestContext.js";
import { attachSession } from "./middlewares/attachSession.js";

const routes = express.Router();

routes.use(attachRequestContext);
routes.use(attachSession);

routes.use("/auth", authRoutes);
routes.use("/hello-world", helloWorldRoutes);

export default routes;
