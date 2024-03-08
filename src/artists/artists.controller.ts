import {
  Body,
  Controller,
  Delete,
  Get, HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
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

@ApiTags('artists')
@Controller('artist')
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly tracksService: TracksService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Return the list of artists',
  })
  getAllArtists(): Promise<Artist[]> {
    return this.artistsService.getAllArtists();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get an artist by id' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Return the artist with the specified id',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Artist not found',
  })
  async getArtistById(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Artist> {
    if (!validate(artistId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid artistId' });
      return;
    }
    const artist = await this.artistsService.getArtistById(artistId);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Artist not found' });
      return;
    }
    return artist;
  }

  @Post()
  @ApiOperation({ summary: 'Create artist' })
  @ApiResponse({ status: 201, description: 'Artist created' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'Artist already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
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
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Artist updated successfully',
    type: Artist,
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Artist not found',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid artist data',
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
        .send({ error: 'Invalid artist data' });
      return;
    }
    const artist = await this.artistsService.getArtistById(artistId);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Artist not found' });
      return;
    }
    return await this.artistsService.updateArtist(artistId, updateArtistDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Delete an artist by id' })
  @ApiOkResponse({
    status: StatusCodes.OK,
    description: 'Artist deleted successfully',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Artist not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async deleteArtist(
    @Param('id') artistId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!validate(artistId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid artistId' });
      return;
    }
    const artist = await this.artistsService.getArtistById(artistId);
    if (!artist) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Artist not found' });
      return;
    }
    await this.artistsService.deleteArtist(artistId);
    await this.tracksService.removeArtistIdFromTrack(artistId);
    res.status(StatusCodes.NO_CONTENT).send();
  }
}
