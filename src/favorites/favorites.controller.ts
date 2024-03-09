import { Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { StatusCodes } from 'http-status-codes';
import { validate } from 'uuid';
import { Response } from 'express';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ArtistsService } from '../artists/artists.service';

@ApiTags('favorites')
@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: StatusCodes.OK,
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
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Track added to favorites',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid ID - Not a valid UUID',
  })
  @ApiResponse({
    status: StatusCodes.UNPROCESSABLE_ENTITY,
    description: "Track doesn't exist",
  })
  async addTrackToFavorites(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(trackId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        error: 'Invalid trackId',
      });
      return;
    }
    const tracks = await this.tracksService.getAllTracks();
    const track = tracks.find((track) => track.id === trackId);
    if (!track) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        error: "Track doesn't exist",
      });
      return;
    }
    this.favoritesService.addTrackToFavorites(trackId);
    return track;
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Remove track from favorites' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({
    status: StatusCodes.NO_CONTENT,
    description: 'Track removed from favorites',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid ID - Not a valid UUID',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Track is not favorite',
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
          error: 'Track is not favorite',
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
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Album added to favorites',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid ID - Not a valid UUID',
  })
  @ApiResponse({
    status: StatusCodes.UNPROCESSABLE_ENTITY,
    description: "Album doesn't exist",
  })
  async addAlbumToFavorites(
    @Param('id') albumId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(albumId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        error: 'Invalid albumId',
      });
      return;
    }
    const albums = await this.albumsService.getAllAlbums();
    const album = albums.find((album) => album.id === albumId);
    if (!album) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        error: "Album doesn't exist",
      });
      return;
    }
    this.favoritesService.addAlbumToFavorites(albumId);
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Remove album from favorites' })
  @ApiParam({ name: 'id', description: 'Album ID' })
  @ApiResponse({
    status: StatusCodes.NO_CONTENT,
    description: 'Album removed from favorites',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid ID - Not a valid UUID',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Album is not favorite',
  })
  async deleteAlbumFromFavorites(
    @Param('id') albumId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(albumId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid albumId' });
      return;
    }
    const status: StatusCodes =
      await this.favoritesService.deleteAlbumFromFavorites(albumId);
    switch (status) {
      case StatusCodes.NOT_FOUND:
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ error: 'Album is not favorite' });
        return;
      case StatusCodes.NO_CONTENT:
        res.status(StatusCodes.NO_CONTENT).send();
        return;
    }
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to favorites' })
  @ApiParam({ name: 'id', description: 'Artist ID' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Artist added to favorites',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid ID - Not a valid UUID',
  })
  @ApiResponse({
    status: StatusCodes.UNPROCESSABLE_ENTITY,
    description: "Artist doesn't exist",
  })
  async addArtistToFavorites(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!validate(artistId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        error: 'Invalid artistId',
      });
      return;
    }
    const artists = await this.artistsService.getAllArtists();
    const artist = artists.find((artist) => artist.id === artistId);
    if (!artist) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
        error: "Artist doesn't exist",
      });
      return;
    }
    this.favoritesService.addArtistToFavorites(artistId);
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Remove artist from favorites' })
  @ApiParam({ name: 'id', description: 'Artist ID' })
  @ApiResponse({
    status: StatusCodes.NO_CONTENT,
    description: 'Artist removed from favorites',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid ID - Not a valid UUID',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Artist is not favorite',
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
          .send({ error: 'Artist is not favorite' });
        return;
      case StatusCodes.NO_CONTENT:
        res.status(StatusCodes.NO_CONTENT).send();
        return;
    }
  }
}
