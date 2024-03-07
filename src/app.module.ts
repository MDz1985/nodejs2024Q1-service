import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, TracksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
