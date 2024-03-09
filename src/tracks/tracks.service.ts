import { Injectable } from '@nestjs/common';
import { Track } from './common/interfaces/track.interface';
import { UpdateTrackDto } from './common/dto/update-track.dto';
import { CreateTrackDto } from './common/dto/create-track.dto';

@Injectable()
export class TracksService {
  private _tracks: Track[] = [];

  getAllTracks(): Track[] {
    return this._tracks;
  }

  async getTrackById(id: string): Promise<Track | undefined> {
    return this._tracks.find((track) => track.id === id);
  }

  async createTrack(dto: CreateTrackDto): Promise<Track> {
    const track = new Track(dto);
    this._tracks.push(track);
    return track;
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = this.getTrackById(id);
    if (track) {
      Object.assign(track, dto);
    }
    return track;
  }

  async deleteTrack(id: string): Promise<void> {
    this._tracks = this._tracks.filter((track) => track.id !== id);
  }

  async removeArtistIdFromTrack(artistId: string) {
    this._tracks = this._tracks.map((track: Track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
      return track;
    });
  }

  async removeAlbumIdFromTrack(albumId: string) {
    this._tracks = this._tracks.map((track: Track) => {
      if (track.albumId === albumId) {
        track.artistId = null;
      }
      return track;
    });
  }
}
