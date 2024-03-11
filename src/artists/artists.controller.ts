import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { StatusCodes } from 'http-status-codes';
import { Artist } from './common/interfaces/artist.interface';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateArtistDto } from './common/dto/create-artist.dto';
import { UpdateArtistDto } from './common/dto/update-artist.dto';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';
import { ARTIST_ERRORS } from './common/enums/errors.enum';

@ApiTags('artists')
@Controller('artist')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiOkResponse({
    type: [Artist],
    description: 'Return the list of artists',
  })
  getAllArtists(): Promise<Artist[]> {
    return this.artistsService.getAllArtists();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get an artist by id' })
  @ApiOkResponse({
    type: Artist,
    description: 'Return the artist with the specified id',
  })
  @ApiBadRequestResponse({
    description: ARTIST_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({
    description: ARTIST_ERRORS.ARTIST_DOESNT_EXIST,
  })
  async getArtistById(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Artist> {
    if (!validate(artistId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: ARTIST_ERRORS.INVALID_ID });
      return;
    }
    const artist = await this.artistsService.getArtistById(artistId);
    if (!artist) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: ARTIST_ERRORS.ARTIST_DOESNT_EXIST });
      return;
    }
    return artist;
  }

  @Post()
  @ApiOperation({ summary: 'Create artist' })
  @ApiCreatedResponse({
    type: Artist,
    description: 'Artist created',
  })
  @ApiBadRequestResponse({ description: ARTIST_ERRORS.NOT_ALL_FIELDS })
  async createArtist(
    @Body() dto: CreateArtistDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Artist> {
    if (
      typeof dto !== 'object' ||
      dto === null ||
      Object.keys(dto).length < 2 ||
      Object.keys(dto).length > 4 ||
      typeof dto?.name !== 'string'
    ) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid data' });
      return;
    }
    res
      .status(StatusCodes.CREATED)
      .send(await this.artistsService.createArtist(dto));
    return;
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Update an artist by id' })
  @ApiOkResponse({
    description: 'Artist updated successfully',
    type: Artist,
  })
  @ApiNotFoundResponse({
    status: StatusCodes.NOT_FOUND,
    description: ARTIST_ERRORS.INVALID_ID,
  })
  @ApiBadRequestResponse({
    description: ARTIST_ERRORS.NOT_ALL_FIELDS,
  })
  async updateArtist(
    @Param('id') artistId: string,
    @Body() updateArtistDto: UpdateArtistDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Artist | { error: string }> {
    if (
      !validate(artistId) ||
      !updateArtistDto?.name ||
      (updateArtistDto?.grammy && typeof updateArtistDto?.grammy !== 'boolean')
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: ARTIST_ERRORS.INVALID_ID });
      return;
    }
    const artist = await this.artistsService.getArtistById(artistId);
    if (!artist) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: ARTIST_ERRORS.ARTIST_DOESNT_EXIST });
      return;
    }
    return await this.artistsService.updateArtist(artistId, updateArtistDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Delete an artist by id' })
  @ApiOkResponse({
    description: 'Artist deleted successfully',
  })
  @ApiNotFoundResponse({
    status: StatusCodes.NOT_FOUND,
    description: ARTIST_ERRORS.ARTIST_DOESNT_EXIST,
  })
  @ApiBadRequestResponse({
    description: ARTIST_ERRORS.INVALID_ID,
  })
  async deleteArtist(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!validate(artistId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: ARTIST_ERRORS.INVALID_ID });
      return;
    }
    const artist = await this.artistsService.getArtistById(artistId);
    if (!artist) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: ARTIST_ERRORS.ARTIST_DOESNT_EXIST });
      return;
    }
    await this.artistsService.deleteArtist(artistId);
    await this.tracksService.removeArtistIdFromTrack(artistId);
    await this.albumsService.removeArtistIdFromAlbum(artistId);
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
