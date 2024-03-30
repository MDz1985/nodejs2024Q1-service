import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

const { REFRESH_TOKEN_EXPIRE_TIME, JWT_SECRET_KEY } = process.env;

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: {
        expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
