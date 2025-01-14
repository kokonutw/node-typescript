import { AuthToken } from "../../../application/auth/auth.interface";
import { JwtAdaptar } from "../../../config/jwt-adapter";
import { PayloadToken } from "../../dto/auth/payload-token";
import { RegisterUserDto } from "../../dto/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";




interface RegisterUserUseCase{
    execute(registerUserDto: RegisterUserDto): Promise<AuthToken>
}

type SignToken = (payload: PayloadToken, duration?: string)=> Promise<string | null>


export class RegisterUser implements RegisterUserUseCase{

    constructor(private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdaptar.generateToken  //<--- function generateToken
    ){}



    async execute(registerUserDto: RegisterUserDto): Promise<AuthToken> {
        
        const user = await this.authRepository.register(registerUserDto);

        const token = await this.signToken({role: user.role,sub: user.id})
        
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