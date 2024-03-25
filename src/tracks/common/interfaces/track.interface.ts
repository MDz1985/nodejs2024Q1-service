import { CreateTrackDto } from '../dto/create-track.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  name: string;
  @ApiProperty()
  artistId: string | null; // refers to Artist
  @ApiProperty()
  albumId: string | null; // refers to Album
  @ApiProperty()
  duration: number; // integer number

  constructor(dto: CreateTrackDto) {
    Object.assign(this, dto);
    this.id = uuid();
  }
}
