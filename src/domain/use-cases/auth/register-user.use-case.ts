import { JwtAdaptar } from "../../../config/jwt-adapter";
import { RegisterUserDto } from "../../dto/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";


interface UserToken{
    accessToken: string,
    user: {
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        profile: string,
        role: string[]
    }
}

interface RegisterUserUseCase{
    execute(registerUserDto: RegisterUserDto): Promise<UserToken>
}

type SignToken = (payload: Object, duration?: string)=> Promise<string | null>


export class RegisterUser implements RegisterUserUseCase{

    constructor(private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdaptar.generateToken  //<--- function generateToken
    ){}



    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
        const user = await this.authRepository.register(registerUserDto);

        const token = await this.signToken({id: user.id})
        
        if(!token) throw CustomError.internalServer('Error generating token')
        
        
        return{
            accessToken: token,
            user:{
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                profile: user.img!,
                role: user.role
            }
        }
    }

    


}