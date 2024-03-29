import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from '../users/common/dto/create-user.dto';
import { StatusCodes } from 'http-status-codes';
import { USER_ERRORS } from '../users/common/enums/errors.enum';
import { User } from '../users/common/interfaces/user.interface';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up' })
  async signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<User, 'password'>> {
    if (
      typeof dto !== 'object' ||
      dto === null ||
      Object.keys(dto).length !== 2 ||
      typeof dto?.login !== 'string' ||
      typeof dto?.password !== 'string'
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: USER_ERRORS.NOT_ALL_FIELDS });
      return;
    }
    dto.password = await bcrypt.hash(dto.password, 10);
    return this._usersService.createUser(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    if (
      typeof dto !== 'object' ||
      dto === null ||
      Object.keys(dto).length !== 2 ||
      typeof dto?.login !== 'string' ||
      typeof dto?.password !== 'string'
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: USER_ERRORS.NOT_ALL_FIELDS });
      return;
    }
    const payload = { userId: 'user.id', login: 'user.login' };
    const accessToken = this._jwtService.sign(payload);
    const refreshToken = this._jwtService.sign(payload, { expiresIn: '1d' }); // Set the expiration time for the refresh token
    return { accessToken, refreshToken };
  }
}
