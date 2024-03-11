import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { StatusCodes } from 'http-status-codes';
import { Track } from './common/interfaces/track.interface';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateTrackDto } from './common/dto/create-track.dto';
import { UpdateTrackDto } from './common/dto/update-track.dto';
import { TRACK_ERRORS } from './common/enums/errors.enum';

@ApiTags('tracks')
@Controller('track')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
  @ApiOkResponse({
    description: 'Return the record with provided id',
  })
  @ApiBadRequestResponse({ description: TRACK_ERRORS.INVALID_ID })
  @ApiNotFoundResponse({
    description: TRACK_ERRORS.TRACK_DOESNT_EXIST,
  })
  async getTrackById(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Track | { error: string }> {
    if (!validate(trackId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: TRACK_ERRORS.INVALID_ID });
      return;
    }
    const track: Track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: TRACK_ERRORS.TRACK_DOESNT_EXIST });
      return;
    }
    return track;
  }

  @Post()
  @ApiOperation({ summary: 'Create track' })
  @ApiCreatedResponse({ description: 'Track created' })
  @ApiBadRequestResponse({ description: TRACK_ERRORS.TRACK_DOESNT_EXIST })
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
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: TRACK_ERRORS.TRACK_DOESNT_EXIST });
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
    description: 'Return the updated track',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: TRACK_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({ description: TRACK_ERRORS.TRACK_DOESNT_EXIST })
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
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: TRACK_ERRORS.INVALID_ID });
      return;
    }
    const track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: TRACK_ERRORS.TRACK_DOESNT_EXIST });
      return;
    }
    return await this.tracksService.updateTrack(trackId, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete track' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Track deleted' })
  @ApiBadRequestResponse({
    description: TRACK_ERRORS.INVALID_ID,
  })
  @ApiNotFoundResponse({ description: TRACK_ERRORS.TRACK_DOESNT_EXIST })
  async deleteTrack(
    @Param('id') trackId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    if (!validate(trackId)) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: TRACK_ERRORS.INVALID_ID });
      return;
    }
    const track = await this.tracksService.getTrackById(trackId);
    if (!track) {
      res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: TRACK_ERRORS.TRACK_DOESNT_EXIST });
      return;
    }
    await this.tracksService.deleteTrack(trackId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
