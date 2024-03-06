import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private _users: any[] = [];
  getAllUsers(): any[] {
    return this._users;
  }
}
