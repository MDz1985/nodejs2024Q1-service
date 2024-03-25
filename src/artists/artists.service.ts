import { Injectable } from '@nestjs/common';
import { Artist } from './common/interfaces/artist.interface';
import { CreateArtistDto } from './common/dto/create-artist.dto';
import { UpdateArtistDto } from './common/dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly _prisma: PrismaService) {}

  async getAllArtists(): Promise<Artist[]> {
    return this._prisma.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    return this._prisma.artist.findUnique({ where: { id } });
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    return this._prisma.artist.create({ data: dto });
  }

  async updateArtist(id: string, dto: UpdateArtistDto): Promise<Artist> {
    return this._prisma.artist.update({ where: { id }, data: dto });
  }

  async deleteArtist(id: string): Promise<void> {
    await this._prisma.artist.delete({ where: { id } });
  }
}
