import { Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { StatusCodes } from 'http-status-codes';
import { validate } from 'uuid';
import { Response } from 'express';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';
import { Favorites } from './common/interfaces/favorites.interface';
import { FAVORITES_ERRORS } from './common/enums/errors.enum';

@ApiTags('favorites')
@Controller('favs')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiOkResponse({
    type: Favorites,
    description: 'Return the list of favorites',
  })
  async getFavorites() {
    const tracks = await this.tracksService.getAllTracks();
    const albums = await this.albumsService.getAllAlbums();
    const artists = await this.artistsService.getAllArtists();
    return this.favoritesService.getFavorites(
      tracks ?? [],
      albums ?? [],
      artists ?? [],
    );
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add track to favorites' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiOkResponse({
    description: 'Track added to favorites',
  })
  @ApiBadRequestResponse({
    description: FAVORITES_ERRORS.INVALID_ID,
  })
  @ApiUnprocessableEntityResponse({
    description: FAVORITES_ERRORS.TRACK_NOT_EXIST,
  })
  async addTrackToFavorites(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(trackId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        error: FAVORITES_ERRORS.INVALID_ID,
      });
      return;
    }
    const tracks = await this.tracksService.getAllTracks();
    const track = tracks.find((track) => track.id === trackId);
    if (!track) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        error: FAVORITES_ERRORS.TRACK_NOT_EXIST,
      });
      return;
    }
    this.favoritesService.addTrackToFavorites(trackId);
    return track;
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Remove track from favorites' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiNoContentResponse({
    description: 'Track removed from favorites',
  })
  @ApiBadRequestResponse({
    description: FAVORITES_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: FAVORITES_ERRORS.NOT_FAVORITE_TRACK,
  })
  async deleteTrackFromFavorites(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(trackId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid trackId' });
      return;
    }
    const status: StatusCodes =
      await this.favoritesService.deleteTrackFromFavorites(trackId);
    switch (status) {
      case StatusCodes.NOT_FOUND:
        res.status(StatusCodes.NOT_FOUND).send({
          error: FAVORITES_ERRORS.NOT_FAVORITE_TRACK,
        });
        return;
      case StatusCodes.NO_CONTENT:
        res.status(StatusCodes.NO_CONTENT).send();
        return;
    }
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to favorites' })
  @ApiParam({ name: 'id', description: 'Album ID' })
  @ApiOkResponse({
    description: 'Album added to favorites',
  })
  @ApiBadRequestResponse({
    description: FAVORITES_ERRORS.INVALID_ID,
  })
  @ApiUnprocessableEntityResponse({
    description: FAVORITES_ERRORS.ALBUM_NOT_EXIST,
  })
  async addAlbumToFavorites(
    @Param('id') albumId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(albumId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        error: FAVORITES_ERRORS.INVALID_ID,
      });
      return;
    }
    const albums = await this.albumsService.getAllAlbums();
    const album = albums.find((album) => album.id === albumId);
    if (!album) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        error: FAVORITES_ERRORS.ALBUM_NOT_EXIST,
      });
      return;
    }
    this.favoritesService.addAlbumToFavorites(albumId);
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Remove album from favorites' })
  @ApiParam({ name: 'id', description: 'Album ID' })
  @ApiNoContentResponse({
    description: 'Album removed from favorites',
  })
  @ApiBadRequestResponse({
    description: FAVORITES_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: FAVORITES_ERRORS.NOT_FAVORITE_ALBUM,
  })
  async deleteAlbumFromFavorites(
    @Param('id') albumId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(albumId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: FAVORITES_ERRORS.INVALID_ID });
      return;
    }
    const status: StatusCodes =
      await this.favoritesService.deleteAlbumFromFavorites(albumId);
    switch (status) {
      case StatusCodes.NOT_FOUND:
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ error: FAVORITES_ERRORS.NOT_FAVORITE_ALBUM });
        return;
      case StatusCodes.NO_CONTENT:
        res.status(StatusCodes.NO_CONTENT).send();
        return;
    }
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiParam({ name: 'id', description: 'Artist ID' })
  @ApiOkResponse({
    description: 'Artist added to favorites',
  })
  @ApiBadRequestResponse({
    description: FAVORITES_ERRORS.INVALID_ID,
  })
  @ApiUnprocessableEntityResponse({
    description: FAVORITES_ERRORS.ARTIST_NOT_EXIST,
  })
  async addArtistToFavorites(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(artistId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        error: FAVORITES_ERRORS.INVALID_ID,
      });
      return;
    }
    const artists = await this.artistsService.getAllArtists();
    const artist = artists.find((artist) => artist.id === artistId);
    if (!artist) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        error: FAVORITES_ERRORS.ARTIST_NOT_EXIST,
      });
      return;
    }
    this.favoritesService.addArtistToFavorites(artistId);
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Remove artist from favorites' })
  @ApiParam({ name: 'id', description: 'Artist ID' })
  @ApiNoContentResponse({
    description: 'Artist removed from favorites',
  })
  @ApiBadRequestResponse({
    description: FAVORITES_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: FAVORITES_ERRORS.NOT_FAVORITE_ARTIST,
  })
  async deleteArtistFromFavorites(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(artistId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid artistId' });
      return;
    }
    const status: StatusCodes =
      await this.favoritesService.deleteArtistFromFavorites(artistId);
    switch (status) {
      case StatusCodes.NOT_FOUND:
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ error: FAVORITES_ERRORS.NOT_FAVORITE_ARTIST });
        return;
      case StatusCodes.NO_CONTENT:
        res.status(StatusCodes.NO_CONTENT).send();
        return;
    }
  }
}
