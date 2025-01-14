import { Request, Response } from "express";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RegisterUserDto } from "../../domain/dto/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom.error";
import { RegisterUser } from "../../domain/use-cases/auth/register-user.use-case";
import { LoginUserDto } from "../../domain/dto/auth/login-user.dto";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";



export class AuthController{
    //DI
    constructor(
        private readonly authRepository: AuthRepository
    ){}

    private handleError = (error: unknown, res: Response)=> {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message})
        }

        console.log(error);
        return res.status(500).json({error: 'Internal server error'})
    } 

     registerUser = async(req:Request,res:Response): Promise<any> => {
        const {firstname,lastname,email,password} = req.body;
        const [error, registerUserDto] = await RegisterUserDto.create({firstname,lastname,email,password});

        if(error) return res.status(400).json({error});
        
        new RegisterUser(this.authRepository).execute(registerUserDto!)
                .then((user)=> res.json(user))
                .catch((error)=> this.handleError(error, res))
        


    }


    loginUser =  async(req:Request,res:Response): Promise<any> => {
        const {email,password} = req.body;
        const [error, loginUserDto] = LoginUserDto.validate( {email, password} );

        if(error) return res.status(400).json({error});

        new LoginUser(this.authRepository)
                .loginUser(loginUserDto!)
                .then((user)=>res.json(user))
                .catch((error)=> this.handleError(error, res))

    }
}