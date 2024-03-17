import { User } from '../interfaces/user.interface';

export function getUserWithoutPassword(user: User): Omit<User, 'password'> {
  const userWithoutPassword = { ...user };
  userWithoutPassword.createdAt = +user.createdAt;
  userWithoutPassword.updatedAt = +user.updatedAt;
  delete userWithoutPassword.password;
  return userWithoutPassword;
}
