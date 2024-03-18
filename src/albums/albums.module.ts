import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksModule } from '../tracks/tracks.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [TracksModule],
  providers: [AlbumsService, PrismaService],
  controllers: [AlbumsController],
  exports: [AlbumsService],
})
export class AlbumsModule {}
