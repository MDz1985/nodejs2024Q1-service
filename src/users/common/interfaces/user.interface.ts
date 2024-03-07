import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuid } from 'uuid';

export class User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update

  constructor(dto: CreateUserDto) {
    Object.assign(this, dto);
    this.id = uuid();
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
