import { Injectable } from '@nestjs/common';
import { Album } from './common/interfaces/album.interface';
import { CreateAlbumDto } from './common/dto/create-album.dto';
import { UpdateAlbumDto } from './common/dto/update-album.dto';
import { PrismaService } from '../services/prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly _prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    return this._prisma.album.findMany();
  }

  async getAlbumById(id: string): Promise<Album | undefined> {
    return this._prisma.album.findUnique({ where: { id } });
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    return this._prisma.album.create({ data: dto });
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto): Promise<Album> {
    return this._prisma.album.update({ where: { id }, data: dto });
  }

  async deleteAlbum(id: string): Promise<void> {
    await this._prisma.album.delete({ where: { id } });
  }

  async removeArtistIdFromAlbum(artistId: string) {
    await this._prisma.album.updateMany({
      where: { artistId },
      data: {
        artistId: null,
      },
    });
  }
}
