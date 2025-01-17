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
