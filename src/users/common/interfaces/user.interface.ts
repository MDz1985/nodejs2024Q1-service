import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  login: string;
  password: string;
  @ApiProperty()
  version: number; // integer number, increments on update
  @ApiProperty()
  createdAt: number; // timestamp of creation
  @ApiProperty()
  updatedAt: number; // timestamp of last update

  constructor(dto: CreateUserDto) {
    Object.assign(this, dto);
    this.id = uuid();
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
