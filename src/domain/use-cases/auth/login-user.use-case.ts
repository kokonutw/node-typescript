import { JwtAdaptar } from "../../../config/jwt-adapter";
import { LoginUserDto } from "../../dto/auth/login-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";


type SignToken = (payload: Object, duration?: string)=> Promise<string | null>

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

interface LoginUserUseCase {
    loginUser(loginUserDto: LoginUserDto): Promise<UserToken>;
}


export class LoginUser implements LoginUserUseCase{

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdaptar.generateToken 
    ){}

    async loginUser(loginUserDto: LoginUserDto): Promise<UserToken> {
        const { email, password } = loginUserDto;

        const user = await this.authRepository.login({email,password});

        const token = await this.signToken( { id: user.id }, '3h' );

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