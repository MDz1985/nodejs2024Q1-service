import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './common/dto/create-user.dto';
import { User } from './common/interfaces/user.interface';
import { UpdatePasswordDto } from './common/dto/update-password.dto';
import { getUserWithoutPassword } from './common/helpers/user.helper';
import { PrismaService } from '../prisma/prisma.service';
import { getDataWithDateAsDate, getDataWithDateAsNumber } from '../common/helpers/helpers';

@Injectable()
export class UsersService {
  private _users: any[] = [];

  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users.map((user) => {
      return {
        ...user,
        createdAt: new Date(user.createdAt).getTime(),
        updatedAt: new Date(user.updatedAt).getTime(),
      };
    });
    // return this._users.map((user) => getUserWithoutPassword(user));
  }

  async createUser(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user: User = new User(dto);
    // this._users.push(user);

    return this.prisma.user
      .create({
        data: getDataWithDateAsDate<User>(user),
      })
      .then((user) => {
        return getUserWithoutPassword(getDataWithDateAsNumber<User>(user));
      });
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId, },
    }).then((user)=> user ? getDataWithDateAsNumber<User>(user) : null);
  }

  async updateUser(user: User, dto: UpdatePasswordDto) {
    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    return this.prisma.user.update({where: {id: user.id}, data: getDataWithDateAsDate<User>(user)}).then(
      (user) => getUserWithoutPassword(getDataWithDateAsNumber<User>(user)),
    )
  }

  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
    // this._users = this._users.filter((user: User) => user.id !== userId);
  }
}
