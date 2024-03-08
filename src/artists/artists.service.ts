import { Injectable } from '@nestjs/common';
import { Artist } from './common/interfaces/artist.interface';
import { CreateArtistDto } from './common/dto/create-artist.dto';
import { UpdateArtistDto } from './common/dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  private _artists: Artist[] = [];

  async getAllArtists(): Promise<Artist[]> {
    return this._artists;
  }

  async getArtistById(id: string): Promise<Artist | undefined> {
    return this._artists.find((artist) => artist.id === id);
  }

  async createArtist(dto: CreateArtistDto): Promise<Artist> {
    const artist = new Artist(dto);
    this._artists.push(artist);
    return artist;
  }

  async updateArtist(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.getArtistById(id);
    if (artist) {
      Object.assign(artist, dto);
    }
    return artist;
  }

  async deleteArtist(id: string): Promise<void> {
    this._artists = this._artists.filter((artist) => artist.id !== id);
  }
}
