import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { UserEntity } from "../entities/user-entity";

export interface UserRepository {
  getUser(): Promise<UserEntity[]>;
  getUserById(id: string): Promise<UserEntity>;
  createUser(user: CreateUserDto): Promise<UserEntity>;
  updateUser(id: string, userUpdate: UpdateUserDto): Promise<UserEntity>;
  deleteUser(id: string): Promise<UserEntity>;
}
