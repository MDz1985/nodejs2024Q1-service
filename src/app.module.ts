import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, ArtistsModule, AlbumsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
