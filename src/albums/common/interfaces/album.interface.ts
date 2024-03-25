import { CreateAlbumDto } from '../dto/create-album.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  name: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  artistId: string | null; // refers to Artist

  constructor(dto: CreateAlbumDto) {
    Object.assign(this, dto);
    this.id = uuid();
  }
}
