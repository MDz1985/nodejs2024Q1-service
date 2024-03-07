import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './common/interfaces/user.interface';
import { CreateUserDto } from './common/dto/create-user.dto';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { validate } from 'uuid';
import { UpdatePasswordDto } from './common/dto/update-password.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    status: 200,
    description: 'Return the list of users',
    type: [User],
  })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user bu id' })
  @ApiOkResponse({ status: 200, description: 'Return the user', type: User })
  @ApiBadRequestResponse({ status: 400, description: 'Invalid userId' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserById(
    @Param('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User | { error: string }> {
    if (!validate(userId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid userId' });
      return;
    }
    const user: User = await this.usersService.getUserById(userId);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ status: 200, description: 'Return the user', type: User })
  @ApiBadRequestResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createUser(
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
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid data' });
      return;
    }
    return this.usersService.createUser(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({ status: 200, description: 'Return the user', type: User })
  @ApiBadRequestResponse({ status: 400, description: 'Invalid userId' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updatePassword(
    @Param('id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<User, 'password'> | { error: string }> {
    if (
      !validate(userId) ||
      typeof updatePasswordDto?.newPassword !== 'string' ||
      typeof updatePasswordDto?.oldPassword !== 'string' ||
      typeof updatePasswordDto !== 'object' ||
      updatePasswordDto === null ||
      Object.keys(updatePasswordDto)?.length !== 2
    ) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid userId' });
      return;
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      res.status(StatusCodes.FORBIDDEN).send({ error: 'Wrong old password' });
      return;
    }
    return await this.usersService.updateUser(user, updatePasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ status: 204, description: 'User deleted' })
  @ApiBadRequestResponse({ status: 400, description: 'Invalid userId' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteUser(
    @Param('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!validate(userId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid userId' });
      return;
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
      return;
    }
    await this.usersService.deleteUser(userId);
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
