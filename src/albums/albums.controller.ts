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
import { AlbumsService } from './albums.service';
import { StatusCodes } from 'http-status-codes';
import { Album } from './common/interfaces/album.interface';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateAlbumDto } from './common/dto/create-album.dto';
import { UpdateAlbumDto } from './common/dto/update-album.dto';
import { ALBUM_ERRORS } from './common/enums/errors.enum';

@ApiTags('albums')
@Controller('album')
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums' })
  @ApiOkResponse({
    type: [Album],
    description: 'Return the list of albums',
  })
  getAllAlbums(): Promise<Album[]> {
    return this.albumsService.getAllAlbums();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get an album by id' })
  @ApiOkResponse({
    type: Album,
    description: 'Return the album with the specified id',
  })
  @ApiBadRequestResponse({ description: ALBUM_ERRORS.INVALID_ID })
  @ApiNotFoundResponse({ description: ALBUM_ERRORS.ALBUM_DOESNT_EXIST })
  async getAlbumById(
    @Param('id') albumId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Album> {
    if (!validate(albumId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: ALBUM_ERRORS.INVALID_ID });
      return;
    }
    const album = await this.albumsService.getAlbumById(albumId);
    if (!album) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: ALBUM_ERRORS.ALBUM_DOESNT_EXIST });
      return;
    }
    return album;
  }

  @Post()
  @ApiOperation({ summary: 'Create album' })
  @ApiCreatedResponse({
    type: Album,
    description: 'Album created',
  })
  @ApiBadRequestResponse({ description: ALBUM_ERRORS.NOT_ALL_FIELDS })
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
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: ALBUM_ERRORS.NOT_ALL_FIELDS });
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
  @ApiOkResponse({
    description: 'Album updated successfully',
    type: Album,
  })
  @ApiNotFoundResponse({ description: ALBUM_ERRORS.ALBUM_DOESNT_EXIST })
  @ApiBadRequestResponse({ description: ALBUM_ERRORS.INVALID_ID })
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
        .send({ error: ALBUM_ERRORS.INVALID_ID });
      return;
    }
    const album = await this.albumsService.getAlbumById(albumId);
    if (!album) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: ALBUM_ERRORS.ALBUM_DOESNT_EXIST });
      return;
    }
    return await this.albumsService.updateAlbum(albumId, updateAlbumDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Delete an album by id' })
  @ApiOkResponse({ description: 'Album deleted successfully' })
  @ApiBadRequestResponse({ description: ALBUM_ERRORS.INVALID_ID })
  @ApiNotFoundResponse({ description: ALBUM_ERRORS.ALBUM_DOESNT_EXIST })
  async deleteAlbum(
    @Param('id') albumId: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!validate(albumId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: ALBUM_ERRORS.INVALID_ID });
      return;
    }
    const album = await this.albumsService.getAlbumById(albumId);
    if (!album) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: ALBUM_ERRORS.ALBUM_DOESNT_EXIST });
      return;
    }
    await this.albumsService.deleteAlbum(albumId);
    // await this.tracksService.removeAlbumIdFromTrack(albumId);
    res.status(StatusCodes.NO_CONTENT).send();
    return;
  }
}
