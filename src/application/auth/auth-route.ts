import { NextFunction, Request, Response, Router } from "express";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { MongoAuthDataSourceImpl } from "../../infrastructure/datasources/auth/mongo.auth.datasource";
import { PrismaDataSourceImpl } from "../../infrastructure/datasources/auth/prisma.auth.datasource";
import { AuthController } from "./auth-controller";
import { AuthService } from "./auth-service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new PrismaDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);
    //console.log(authRepository);
    const service = new AuthService(authRepository);
    //console.log(service)
    const controller = new AuthController(service);

    //const middleware = new AuthMiddleware();

    router.get("/", (req, res) => {
      res.send("Hola");
    });

    router.post("/register", controller.registerUser);
    router.post("/login", controller.loginUser);

    router.get(
      "/protected",
      [AuthMiddleware.validateJWT],
      (req: Request, res: Response, next: NextFunction) => {
        res.json({ message: "Acceso autorizado", user: req.body.user });
      }
    );

    return router;
  }
}
