import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { StatusCodes } from 'http-status-codes';
import { Track } from './common/interfaces/track.interface';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateTrackDto } from './common/dto/create-track.dto';
import { UpdateTrackDto } from './common/dto/update-track.dto';

@ApiTags('tracks')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({ status: 200, description: 'Return the list of tracks' })
  async getAllTracks() {
    return this.tracksService.getAllTracks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single track by id' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the record with provided id',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID - Not a valid UUID' })
  @ApiResponse({
    status: 404,
    description: 'Record with this id does not exist',
  })
  async getTrackById(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Track | { error: string }> {
    if (!validate(trackId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid trackId' });
      return;
    }
    const track: Track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Track not found' });
      return;
    }
    return track;
  }

  @Get(':id/artist')
  @ApiOperation({ summary: 'Get single track by id' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the record with provided id',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID - Not a valid UUID' })
  @ApiResponse({
    status: 404,
    description: 'Record with this id does not exist',
  })
  async getArtistByTrackId(
    @Param('id') trackId: string,
    @Res() res: Response,
  ): Promise<Track | { error: string }> {
    if (!validate(trackId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid trackId' });
      return;
    }
    const track: Track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Track not found' });
      return;
    }
    return track;
  }

  @Post()
  @ApiOperation({ summary: 'Create track' })
  @ApiResponse({ status: 201, description: 'Track created' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'Track already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createTrack(
    @Body() dto: CreateTrackDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Track> {
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
      .send(await this.tracksService.createTrack(dto));
    return;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update track info' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Return the updated track',
    type: Track,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid trackId',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Track not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async updateTrackInfo(
    @Param('id') trackId: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Track | { error: string }> {
    if (
      !validate(trackId) ||
      !updateTrackDto?.name ||
      !updateTrackDto?.duration
    ) {
      res.status(HttpStatus.BAD_REQUEST).send({ error: 'Invalid trackId' });
      return;
    }
    const track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res.status(HttpStatus.NOT_FOUND).send({ error: 'Track not found' });
      return;
    }
    return await this.tracksService.updateTrack(trackId, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete track' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Track deleted' })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid trackId',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Track not found' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async deleteTrack(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!validate(trackId)) {
      res.status(HttpStatus.BAD_REQUEST).send({ error: 'Invalid trackId' });
      return;
    }
    const track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res.status(HttpStatus.NOT_FOUND).send({ error: 'Track not found' });
      return;
    }
    await this.tracksService.deleteTrack(trackId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
