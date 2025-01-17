export interface Song {
  title: string;
  artist: string;
  year: string;
  playlistId: string;
  albumCover: string;
  spotifyTrackId: string;
}

export interface Playlist {
  name: string;
  spotifyId: string;
}

export enum GameStateEnum {
  Start = 0,
  RevealSong = 1,
  ErrorTryAgain = 2,
  PlaySong = 3,
}

export enum GameModesEnum {
  online = 0,
  qrCode = 1,
}
