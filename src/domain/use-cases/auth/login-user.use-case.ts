import { AuthToken } from "../../../application/auth/auth.interface";
import { JwtAdaptar } from "../../../config/jwt-adapter";
import { LoginUserDto } from "../../dto/auth/login-user.dto";
import { PayloadToken } from "../../dto/auth/payload-token";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";


type SignToken = (payload: PayloadToken, duration?: string)=> Promise<string | null>



interface LoginUserUseCase {
    execute(loginUserDto: LoginUserDto): Promise<AuthToken>;
}


export class LoginUser implements LoginUserUseCase{

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdaptar.generateToken 
    ){}

    async execute(loginUserDto: LoginUserDto): Promise<AuthToken> {
        const { email, password } = loginUserDto;

        const user = await this.authRepository.login({email,password});

        const token = await this.signToken( {role: user.role,sub: user.id}, '3h' );

         if(!token) throw CustomError.internalServer('Error generating token')

        return{
            accessToken: token,
            user: {
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