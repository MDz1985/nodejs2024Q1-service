import { Injectable } from '@nestjs/common';
import { Album } from './common/interfaces/album.interface';
import { CreateAlbumDto } from './common/dto/create-album.dto';
import { UpdateAlbumDto } from './common/dto/update-album.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  // private _albums: Album[] = [];

  constructor(private readonly _prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    return this._prisma.album.findMany();
    // return this._albums;
  }

  async getAlbumById(id: string): Promise<Album | undefined> {
    return this._prisma.album.findUnique({ where: { id } });
    // return this._albums.find((album) => album.id === id);
  }

  async createAlbum(dto: CreateAlbumDto): Promise<Album> {
    const album = new Album(dto);
    return this._prisma.album.create({ data: album });
    // this._albums.push(album);
    // return album;
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto): Promise<Album> {
    return this._prisma.album.update({ where: { id }, data: dto });
    // const album = await this.getAlbumById(id);
    // if (album) {
    //   Object.assign(album, dto);
    // }
    // return album;
  }

  async deleteAlbum(id: string): Promise<void> {
    await this._prisma.album.delete({ where: { id } });
    // this._albums = this._albums.filter((album) => album.id !== id);
  }

  async removeArtistIdFromAlbum(artistId: string) {
    this._prisma.album.updateMany({
      where: { artistId },
      data: {
        artistId: null,
      },
    });
    // this._albums = this._albums.map((album: Album) => {
    //   if (album.artistId === artistId) {
    //     album.artistId = null;
    //   }
    //   return album;
    // });
  }
}
