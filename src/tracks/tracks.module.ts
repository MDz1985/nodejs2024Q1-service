import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TracksService, PrismaService],
  controllers: [TracksController],
  exports: [TracksService],
})
export class TracksModule {}
