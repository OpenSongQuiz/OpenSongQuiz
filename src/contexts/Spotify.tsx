import { createContext, useContext } from "react";
import { SpotifyApi, Track, Device } from "@spotify/web-api-ts-sdk";
import { Song } from "../types/OpenSongQuiz";

interface SpotifyContextProps {
  api?: SpotifyApi;
  connect: {
    devices: Device[] | undefined;
    activeDevice: Device | undefined;
    refreshDevices: () => void;
    setNewActiveDevice: (deviceId: string) => void;
    isChangingDevice: boolean;
  };
  playback: {
    currentSong: Song | undefined;
    setCurrentSong: (song: Song) => void;
    pause: () => void;
    startResume: () => void;
    play: (playlistId: string, track: Track) => Promise<boolean>;
    playPause: () => void;
    setSongFromPlaylist: (playlistId: string, position: number) => Promise<boolean>;
    setRandomSongFromPlaylist: (playlistId: string) => Promise<boolean>;
  };
  login: () => Promise<void>;
  logout: () => void;
}

export const SpotifyContext = createContext<SpotifyContextProps | undefined>(undefined);

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
