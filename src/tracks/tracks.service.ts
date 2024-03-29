import { Injectable } from '@nestjs/common';
import { Track } from './common/interfaces/track.interface';
import { UpdateTrackDto } from './common/dto/update-track.dto';
import { CreateTrackDto } from './common/dto/create-track.dto';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private readonly _prisma: PrismaService) {}

  async getAllTracks(): Promise<Track[]> {
    return this._prisma.track.findMany();
  }

  async getTrackById(id: string): Promise<Track | undefined> {
    return this._prisma.track.findUnique({ where: { id } });
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    const track = new Track(dto);
    return this._prisma.track.create({ data: track });
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track> {
    return this._prisma.track.update({ where: { id }, data: dto });
  }

  async deleteTrack(id: string): Promise<void> {
    await this._prisma.track.delete({ where: { id } });
  }

  async removeArtistIdFromTrack(artistId: string): Promise<void> {
    await this._prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
    // this._tracks = this._tracks.map((track: Track) => {
    //   if (track.artistId === artistId) {
    //     track.artistId = null;
    //   }
    //   return track;
    // });
  }

  async removeAlbumIdFromTrack(albumId: string) {
    await this._prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
    // this._tracks = this._tracks.map((track: Track) => {
    //   if (track.albumId === albumId) {
    //     track.albumId = null;
    //   }
    //   return track;
    // });
  }
}
