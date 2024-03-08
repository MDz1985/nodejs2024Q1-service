import { CreateArtistDto } from '../dto/create-artist.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty()
  id: string; // uuid v4
  @ApiProperty()
  name: string;
  @ApiProperty()
  grammy: boolean;

  constructor(dto: CreateArtistDto) {
    Object.assign(this, dto);
    this.id = uuid();
  }
}
