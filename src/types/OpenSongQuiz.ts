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
  countryCode: string;
  propretiaryId: string;
}

export enum GameStateEnum {
  Start = 0,
  Revealed = 1,
  ErrorTryAgain = 2,
  SongPlaying = 3,
  QrCodeScan = 4
}

export interface QrCodeContent {
  fullUrl: string;
  countryCode: string;
  playlistPosition: number;
  playlistId: string;
  type: string;
}

export enum GameModesEnum {
  online = 0,
  qrCode = 1,
}
