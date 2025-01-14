import { LoginUserDto } from "../../domain/dto/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dto/auth/register-user.dto";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";
import { RegisterUser } from "../../domain/use-cases/auth/register-user.use-case";
import { AuthToken } from "./auth.interface";


export class AuthService{
    
    private readonly loginUser: LoginUser;
    private readonly registerUser: RegisterUser;

    
    constructor(
        private readonly authRepository: AuthRepository,
    ){
        this.loginUser = new LoginUser(this.authRepository); 
        this.registerUser = new RegisterUser(this.authRepository);
    }


  async login(loginUser: LoginUserDto): Promise<AuthToken> {
    return this.loginUser.execute(loginUser);
  }

  async register(registerUser: RegisterUserDto): Promise<AuthToken> {
    return this.registerUser.execute(registerUser);
  }
}