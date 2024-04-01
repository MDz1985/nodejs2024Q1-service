import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './common/dto/create-user.dto';
import {
  User,
  UserWithoutPassword,
  UserWithStringDates,
} from './common/interfaces/user.interface';
import { UpdatePasswordDto } from './common/dto/update-password.dto';
import { getUserWithoutPassword } from './common/helpers/user.helper';
import { PrismaService } from '../services/prisma/prisma.service';
import {
  getDataWithDateAsNumber,
  getDateAsString,
} from '../common/helpers/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly _prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this._prisma.user.findMany({
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
  }

  async createUser(dto: CreateUserDto): Promise<UserWithoutPassword> {
    return this._prisma.user
      .create({
        data: dto,
      })
      .then((user: UserWithStringDates) => {
        return getUserWithoutPassword(
          getDataWithDateAsNumber<UserWithStringDates>(user),
        );
      });
  }

  async getUserById(userId: string): Promise<User | null> {
    return this._prisma.user
      .findUnique({
        where: { id: userId },
      })
      .then((user: UserWithStringDates) =>
        user ? getDataWithDateAsNumber<User>(user) : null,
      );
  }

  async getUserByLogin(login: string) {
    return this._prisma.user.findFirst({
      where: { login },
      select: {
        id: true,
        login: true,
        password: true,
      },
    });
  }

  async updateUser(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<UserWithoutPassword> {
    return this._prisma.user
      .update({
        where: { id },
        data: {
          password: dto.newPassword,
          version: { increment: 1 },
          updatedAt: getDateAsString(Date.now()),
        },
      })
      .then((user: UserWithStringDates) =>
        getUserWithoutPassword(
          getDataWithDateAsNumber<UserWithStringDates>(user),
        ),
      );
  }

  async deleteUser(userId: string): Promise<void> {
    await this._prisma.user.delete({ where: { id: userId } });
  }
}
