import { Router } from "express";

export class UserRoutes {
    
    
    static get routes(): Router{
        const router = Router();


        router.get('/',(req,res)=>{
            res.send('user')
        })

        return router;
    }
}