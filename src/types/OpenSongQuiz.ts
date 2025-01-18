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

export enum GameStates {
  Start = 0,
  Revealed = 1,
  ErrorTryAgain = 2,
  SongPlaying = 3,
  QrCodeScan = 4,
}

export enum GameModes {
  online = 0,
  qrCode = 1,
}

export interface QrCodeContent {
  fullUrl: string;
  countryCode: string;
  playlistPosition: number;
  playlistId: string;
  type: string;
}