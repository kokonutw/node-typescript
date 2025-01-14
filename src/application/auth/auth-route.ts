import { Router } from "express";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth.repository.impl";
import { MongoAuthDataSourceImpl } from "../../infrastructure/datasources/mongo.auth.datasource";
import { PrismaDataSourceImpl } from "../../infrastructure/datasources/prisma.auth.datasource";
import { AuthController } from "./auth-controller";

export class AuthRoutes {
    
    
    static get routes(): Router{
        const router = Router();

        const datasource = new PrismaDataSourceImpl();
        const authRepository = new AuthRepositoryImpl(datasource);
        const controller = new AuthController(authRepository);

        router.get('/',(req,res)=>{
            res.send('Hola')
        })

        router.post('/register',controller.registerUser );
        router.post('/login', controller.loginUser);
        return router;
    }
}