import { NextFunction, Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUserDto } from "../../domain/dto/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { RegisterUser } from "../../domain/use-cases/auth/register-user.use-case";
import { LoginUserDto } from "../../domain/dto/auth/login-user.dto";
import { AuthService } from "./auth-service";



export class AuthController{
    
    constructor(
        private readonly authService: AuthService
    ){}



     registerUser = async(req:Request,res:Response,next:NextFunction): Promise<any> => {
        const {firstname,lastname,email,password} = req.body;
        const [error, registerUserDto] = await RegisterUserDto.create({firstname,lastname,email,password});

        if(error) return res.status(400).json({error});
        
        
        try {
            const authToken = await this.authService.register(registerUserDto!);
            if(!authToken) return res.status(401).json({error: 'Invalid credentials, service'})

            res.json(authToken)
            
        } catch (error) {
            next(error)
        }


    }


    loginUser =  async(req:Request,res:Response,next:NextFunction): Promise<any> => {
        const {email,password} = req.body;
        const [error, loginUserDto] = LoginUserDto.validate( {email, password} );

        if(error) return res.status(400).json({error});

        try {
            const authToken = await this.authService.login(loginUserDto!);

            if(!authToken) return res.status(401).json({error: 'Invalid credentials, service'})
                
            res.json(authToken)
        } catch (error) {
            next(error)
        }

    }
}