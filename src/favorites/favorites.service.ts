import { Injectable } from '@nestjs/common';
import { Favorites } from './common/interfaces/favorites.interface';
import { StatusCodes } from 'http-status-codes';
import { Track } from '../tracks/common/interfaces/track.interface';
import { Album } from '../albums/common/interfaces/album.interface';
import { Artist } from '../artists/common/interfaces/artist.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  // private _favorites: Favorites = new Favorites();

  constructor(private readonly _prisma: PrismaService) {
    this.init();
  }

  async getFavorites(
    allTracks: Track[],
    allAlbums: Album[],
    allArtists: Artist[],
  ) {
    const favorites: Favorites = await this._prisma.favorites.findFirst();
    const tracks = await this._prisma.track.findMany({
      where: { id: { in: favorites.tracks } },
    });
    const albums = await this._prisma.album.findMany({
      where: { id: { in: favorites.albums } },
    });
    const artists = await this._prisma.artist.findMany({
      where: { id: { in: favorites.artists } },
    });

    // const tracks = allTracks.filter((track) =>
    //   this._favorites.tracks.includes(track.id),
    // );
    // const albums = allAlbums.filter((album) =>
    //   this._favorites.albums.includes(album.id),
    // );
    // const artists = allArtists.filter((artist) =>
    //   this._favorites.artists.includes(artist.id),
    // );
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
    // this._favorites.tracks.push(trackId);
  }

  async deleteTrackFromFavorites(trackId: string) {
    const favorites = await this._prisma.favorites.findFirst();
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
    // if (!this._favorites.tracks.includes(trackId)) {
    //   return StatusCodes.NOT_FOUND;
    // }
    // this._favorites.tracks = this._favorites.tracks.filter(
    //   (track) => track !== trackId,
    // );
    // return StatusCodes.NO_CONTENT;
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    await this._prisma.favorites.update({
      where: { id: 1 },
      data: { albums: { push: albumId } },
    });
    // this._favorites.albums.push(albumId);
  }

  async deleteAlbumFromFavorites(albumId: string) {
    const favorites = await this._prisma.favorites.findFirst();
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
    // if (!this._favorites.albums.includes(albumId)) {
    //   return StatusCodes.NOT_FOUND;
    // }
    // this._favorites.albums = this._favorites.albums.filter(
    //   (album) => album !== albumId,
    // );
    // return StatusCodes.NO_CONTENT;
  }

  async addArtistToFavorites(artistId: string) {
    await this._prisma.favorites.update({
      where: { id: 1 },
      data: { artists: { push: artistId } },
    });
    // this._favorites.artists.push(artistId);
  }

  async deleteArtistFromFavorites(artistId: string) {
    const favorites = await this._prisma.favorites.findFirst();
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
    // if (!this._favorites.artists.includes(artistId)) {
    //   return StatusCodes.NOT_FOUND;
    // }
    // this._favorites.artists = this._favorites.artists.filter(
    //   (artist) => artist !== artistId,
    // );
    // return StatusCodes.NO_CONTENT;
  }

  private init() {
    this._prisma.favorites.create({
      data: {
        tracks: [],
        albums: [],
        artists: [],
      },
    });
  }
}
