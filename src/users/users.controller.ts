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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { USER_ERRORS } from './common/enums/errors.enum';
import { getUserWithoutPassword } from './common/helpers/user.helper';

@ApiTags('users')
@Controller('user')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Return the list of users',
    type: [User],
  })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user bu id' })
  @ApiOkResponse({
    description: 'Return the user',
    type: User,
  })
  @ApiBadRequestResponse({
    description: USER_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserById(
    @Param('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<User, 'password'> | { error: string }> {
    if (!validate(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: USER_ERRORS.INVALID_ID });
      return;
    }
    const user: User = await this.usersService.getUserById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: USER_ERRORS.USER_DOESNT_EXIST });
      return;
    }
    return getUserWithoutPassword(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    description: 'Return the user',
    type: User,
  })
  @ApiBadRequestResponse({
    description: USER_ERRORS.NOT_ALL_FIELDS,
  })
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
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: USER_ERRORS.NOT_ALL_FIELDS });
      return;
    }
    return this.usersService.createUser(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user password' })
  @ApiOkResponse({
    description: 'Return the user',
    type: User,
  })
  @ApiBadRequestResponse({
    description: USER_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: USER_ERRORS.USER_DOESNT_EXIST,
  })
  @ApiForbiddenResponse({
    description: USER_ERRORS.WRONG_OLD_PASSWORD,
  })
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
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: USER_ERRORS.INVALID_ID });
      return;
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: USER_ERRORS.USER_DOESNT_EXIST });
      return;
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      res
        .status(StatusCodes.FORBIDDEN)
        .send({ error: USER_ERRORS.WRONG_OLD_PASSWORD });
      return;
    }
    return await this.usersService.updateUser(user, updatePasswordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiBadRequestResponse({
    description: USER_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({ description: USER_ERRORS.USER_DOESNT_EXIST })
  async deleteUser(
    @Param('id') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!validate(userId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: USER_ERRORS.INVALID_ID });
      return;
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: USER_ERRORS.USER_DOESNT_EXIST });
      return;
    }
    await this.usersService.deleteUser(userId);
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
