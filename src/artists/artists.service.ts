import { Injectable } from '@nestjs/common';
import { Artist } from './common/interfaces/artist.interface';
import { CreateArtistDto } from './common/dto/create-artist.dto';
import { UpdateArtistDto } from './common/dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  // private _artists: Artist[] = [];

  constructor(private readonly _prisma: PrismaService) {}
  async getAllArtists(): Promise<Artist[]> {
    return this._prisma.artist.findMany();
    // return this._artists;
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    return this._prisma.artist.findUnique({ where: { id } });
    // return this._artists.find((artist) => artist.id === id);
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    const artist = new Artist(dto);
    return this._prisma.artist.create({ data: artist });
    // this._artists.push(artist);
    // return artist;
  }

  async updateArtist(id: string, dto: UpdateArtistDto): Promise<Artist> {
    return this._prisma.artist.update({ where: { id }, data: dto });
    // const artist = await this.getArtistById(id);
    // if (artist) {
    //   Object.assign(artist, dto);
    // }
    // return artist;
  }

  async deleteArtist(id: string): Promise<void> {
    await this._prisma.artist.delete({ where: { id } });
    // this._artists = this._artists.filter((artist) => artist.id !== id);
  }
}
