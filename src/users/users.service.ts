import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './common/dto/create-user.dto';
import { User } from './common/interfaces/user.interface';
import { UpdatePasswordDto } from './common/dto/update-password.dto';
import { getUserWithoutPassword } from './common/helpers/user.helper';

@Injectable()
export class UsersService {
  private _users: any[] = [];

  getAllUsers(): any[] {
    return this._users.map((user) => getUserWithoutPassword(user));
  }

  createUser(dto: CreateUserDto): Omit<User, 'password'> {
    const user: User = new User(dto);
    this._users.push(user);
    return getUserWithoutPassword(user);
  }

  async getUserById(userId: string): Promise<User> {
    return this._users.find((user) => user.id === userId);
  }

  async updateUser(user: User, dto: UpdatePasswordDto) {
    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    this._users = this._users.map((u: User) => (u.id === user.id ? user : u));
    return getUserWithoutPassword(user);
  }

  async deleteUser(userId: string) {
    this._users = this._users.filter((user: User) => user.id !== userId);
  }
}
