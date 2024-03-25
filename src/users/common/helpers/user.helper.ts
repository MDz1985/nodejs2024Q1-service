import { User } from '../interfaces/user.interface';

export function getUserWithoutPassword(user: User): Omit<User, 'password'> {
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  return userWithoutPassword;
}
