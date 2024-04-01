import { Injectable } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { PrismaService } from '../services/prisma/prisma.service';
import { Album, Artist, Favorites, Track } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly _prisma: PrismaService) {
    this.init();
  }

  async getFavorites() {
    const favorites: Favorites = await this._prisma.favorites.findFirst();
    const tracks: Track[] = await this._prisma.track.findMany({
      where: { id: { in: favorites.tracks } },
    });
    const albums: Album[] = await this._prisma.album.findMany({
      where: { id: { in: favorites.albums } },
    });
    const artists: Artist[] = await this._prisma.artist.findMany({
      where: { id: { in: favorites.artists } },
    });
    return {
      tracks: tracks || [],
      albums: albums || [],
      artists: artists || [],
    };
  }

  async addTrackToFavorites(trackId: string) {
    await this._prisma.favorites.update({
      where: { id: 1 },
      data: { tracks: { push: trackId } },
    });
  }

  async deleteTrackFromFavorites(trackId: string) {
    const favorites: Favorites = await this._prisma.favorites.findFirst();
    try {
      await this._prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: favorites.tracks.filter((track) => track !== trackId),
        },
      });
      return StatusCodes.NO_CONTENT;
    } catch {
      return StatusCodes.NOT_FOUND;
    }
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    await this._prisma.favorites.update({
      where: { id: 1 },
      data: { albums: { push: albumId } },
    });
  }

  async deleteAlbumFromFavorites(albumId: string): Promise<StatusCodes> {
    const favorites: Favorites = await this._prisma.favorites.findFirst();
    try {
      await this._prisma.favorites.update({
        where: { id: 1 },
        data: {
          albums: favorites.albums.filter((album) => album !== albumId),
        },
      });
      return StatusCodes.NO_CONTENT;
    } catch {
      return StatusCodes.NOT_FOUND;
    }
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    await this._prisma.favorites.update({
      where: { id: 1 },
      data: { artists: { push: artistId } },
    });
  }

  async deleteArtistFromFavorites(artistId: string): Promise<StatusCodes> {
    const favorites: Favorites = await this._prisma.favorites.findFirst();
    try {
      await this._prisma.favorites.update({
        where: { id: favorites?.id },
        data: {
          artists: favorites.artists.filter((artist) => artist !== artistId),
        },
      });
      return StatusCodes.NO_CONTENT;
    } catch {
      return StatusCodes.NOT_FOUND;
    }
  }

  private async init(): Promise<void> {
    const favorites: Favorites = await this._prisma.favorites.findFirst();
    if (!favorites?.id) {
      await this._prisma.favorites.create({
        data: {
          tracks: [],
          albums: [],
          artists: [],
        },
      });
    }
  }
}
