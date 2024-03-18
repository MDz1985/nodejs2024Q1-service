import { Injectable } from '@nestjs/common';
import { Track } from './common/interfaces/track.interface';
import { UpdateTrackDto } from './common/dto/update-track.dto';
import { CreateTrackDto } from './common/dto/create-track.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  // private _tracks: Track[] = [];

  constructor(private readonly _prisma: PrismaService) {}

  async getAllTracks(): Promise<Track[]> {
    return this._prisma.track.findMany();
  }

  async getTrackById(id: string): Promise<Track | undefined> {
    return this._prisma.track.findUnique({ where: { id } });
    // return this._tracks.find((track) => track.id === id);
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    const track = new Track(dto);
    return this._prisma.track.create({ data: track });
    // this._tracks.push(track);
    // return track;
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track> {
    return this._prisma.track.update({ where: { id }, data: dto });
    // const track = this.getTrackById(id);
    // if (track) {
    //   Object.assign(track, dto);
    // }
    // return track;
  }

  async deleteTrack(id: string): Promise<void> {
    await this._prisma.track.delete({ where: { id } });
    // this._tracks = this._tracks.filter((track) => track.id !== id);
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
