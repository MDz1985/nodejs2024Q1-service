import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  grammy: boolean | null; // refers to Artist
}
