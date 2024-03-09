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
import { AlbumsService } from './albums.service';
import { StatusCodes } from 'http-status-codes';
import { Album } from './common/interfaces/album.interface';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateAlbumDto } from './common/dto/create-album.dto';
import { UpdateAlbumDto } from './common/dto/update-album.dto';
import { TracksService } from '../tracks/tracks.service';

@ApiTags('albums')
@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Return the list of albums',
  })
  getAllAlbums(): Promise<Album[]> {
    return this.albumsService.getAllAlbums();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get an album by id' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Return the album with the specified id',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Album not found',
  })
  async getAlbumById(
    @Param('id') albumId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Album> {
    if (!validate(albumId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid albumId' });
      return;
    }
    const album = await this.albumsService.getAlbumById(albumId);
    if (!album) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Album not found' });
      return;
    }
    return album;
  }

  @Post()
  @ApiOperation({ summary: 'Create album' })
  @ApiResponse({ status: 201, description: 'Album created' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'Album already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createAlbum(
    @Body() dto: CreateAlbumDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Album> {
    if (
      typeof dto !== 'object' ||
      dto === null ||
      Object.keys(dto).length < 2 ||
      Object.keys(dto).length > 3 ||
      typeof dto?.name !== 'string' ||
      typeof dto?.year !== 'number' ||
      (dto?.artistId && !validate(dto?.artistId))
    ) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid data' });
      return;
    }
    res
      .status(StatusCodes.CREATED)
      .send(await this.albumsService.createAlbum(dto));
    return;
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Update an album by id' })
  @ApiResponse({
    status: StatusCodes.OK,
    description: 'Album updated successfully',
    type: Album,
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Album not found',
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: 'Invalid album data',
  })
  async updateAlbum(
    @Param('id') albumId: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Album | { error: string }> {
    if (
      !validate(albumId) ||
      !updateAlbumDto?.name ||
      !updateAlbumDto?.year ||
      (updateAlbumDto?.artistId && !validate(updateAlbumDto?.artistId))
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: 'Invalid album data' });
      return;
    }
    const album = await this.albumsService.getAlbumById(albumId);
    if (!album) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Album not found' });
      return;
    }
    return await this.albumsService.updateAlbum(albumId, updateAlbumDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Delete an album by id' })
  @ApiOkResponse({
    status: StatusCodes.OK,
    description: 'Album deleted successfully',
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: 'Album not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async deleteAlbum(
    @Param('id') albumId: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!validate(albumId)) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid albumId' });
      return;
    }
    const album = await this.albumsService.getAlbumById(albumId);
    if (!album) {
      res.status(StatusCodes.NOT_FOUND).send({ error: 'Album not found' });
      return;
    }
    await this.albumsService.deleteAlbum(albumId);
    await this.tracksService.removeAlbumIdFromTrack(albumId);
    res.status(StatusCodes.NO_CONTENT).send();
    return;
  }
}
