import { Injectable } from '@nestjs/common';
import { Favorites } from './common/interfaces/favorites.interface';
import { StatusCodes } from 'http-status-codes';
import { Track } from '../tracks/common/interfaces/track.interface';
import { Album } from '../albums/common/interfaces/album.interface';
import { Artist } from '../artists/common/interfaces/artist.interface';

@Injectable()
export class FavoritesService {
  private _favorites: Favorites = new Favorites();

  async getFavorites(
    allTracks: Track[],
    allAlbums: Album[],
    allArtists: Artist[],
  ) {
    const tracks = allTracks.filter((track) =>
      this._favorites.tracks.includes(track.id),
    );
    const albums = allAlbums.filter((album) =>
      this._favorites.albums.includes(album.id),
    );
    const artists = allArtists.filter((artist) =>
      this._favorites.artists.includes(artist.id),
    );
    return {
      tracks,
      albums,
      artists,
    };
  }

  addTrackToFavorites(trackId: string) {
    this._favorites.tracks.push(trackId);
  }

  deleteTrackFromFavorites(trackId: string) {
    if (!this._favorites.tracks.includes(trackId)) {
      return StatusCodes.NOT_FOUND;
    }
    this._favorites.tracks = this._favorites.tracks.filter(
      (track) => track !== trackId,
    );
    return StatusCodes.NO_CONTENT;
  }

  addAlbumToFavorites(albumId: string) {
    this._favorites.albums.push(albumId);
  }

  deleteAlbumFromFavorites(albumId: string) {
    if (!this._favorites.albums.includes(albumId)) {
      return StatusCodes.NOT_FOUND;
    }
    this._favorites.albums = this._favorites.albums.filter(
      (album) => album !== albumId,
    );
    return StatusCodes.NO_CONTENT;
  }

  addArtistToFavorites(artistId: string) {
    this._favorites.artists.push(artistId);
  }

  deleteArtistFromFavorites(artistId: string) {
    if (!this._favorites.artists.includes(artistId)) {
      return StatusCodes.NOT_FOUND;
    }
    this._favorites.artists = this._favorites.artists.filter(
      (artist) => artist !== artistId,
    );
    return StatusCodes.NO_CONTENT;
  }
}
