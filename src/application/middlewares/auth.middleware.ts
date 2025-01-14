import { NextFunction, Request, Response } from "express";
import { JwtAdaptar } from "../../config/jwt-adapter";
import { UserModel } from "../../data";

export class AuthMiddleware {



    static  validateJWT = async(req: Request, res: Response, next: NextFunction) => {

        const authorization = req.header('Authorization');

        if(!authorization) return res.status(401).json({ error: "Unauthorized, No token provided" });

        if(!authorization.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized, Invalid token" });

        const token = authorization.split(' ').at(1) || "";
        
        try {

            const payload = await JwtAdaptar.validateToken<{id: string}>(token);
            
            if(!payload) return res.status(401).json({ error: "Unauthorized, Invalid token" });
            
            
            // TODO: buscar la forma de poder llamar al controller o repository
            const user = await UserModel.findById(payload.id);

            if(!user) return res.status(401).json({ error: "y el usuario - token?" });


            req.body.user = user;

            next();
        } catch (error) {
            return res.status(401).json({ error: "Unauthorized, Invalid token" });
        }
        
    }
}