import { createContext, useContext, useEffect, useState } from "react";
import { SpotifyApi, AuthorizationCodeWithPKCEStrategy, Scopes, Track, Device } from "@spotify/web-api-ts-sdk";
import { Song } from "../types/OpenSongQuiz";

interface SpotifyContextProps {
  api?: SpotifyApi;
  connect: {
    devices: Device[] | undefined;
    activeDevice: Device | undefined;
    refreshDevices: () => void;
    setNewActiveDevice: (deviceId: string) => void;
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

const SpotifyContext = createContext<SpotifyContextProps | undefined>(undefined);

type SpotifyProviderProps = {
  children?: React.ReactNode;
};

export const SpotifyProvider: React.FC<SpotifyProviderProps> = ({ children }) => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes = [...Scopes.playlistRead, ...Scopes.userPlayback, ...Scopes.userPlaybackModify, "user-read-email"];

  const [sdk, setSdk] = useState<SpotifyApi | undefined>(undefined);
  const [devices, setDevices] = useState<Device[] | undefined>();
  const [activeDevice, setActiveDevice] = useState<Device | undefined>(undefined);
  const [currentSong, setCurrentSong] = useState<Song | undefined>();

  const refreshDevices = async () => {
    if (!sdk) return;

    const newDevices = await sdk.player.getAvailableDevices();

    // Manually check if device list changed, because otherwise react is constantly polling new devices.
    if (
      devices?.length === newDevices.devices.length &&
      devices.every(
        (device, index) =>
          device.id === newDevices.devices[index].id && device.is_active === newDevices.devices[index].is_active,
      )
    ) {
      return;
    }

    setDevices(newDevices.devices);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      // The code query-param indicates the redirect after login => complete login.
      login();
      return;
    }

    if (!sdk) checkAccessToken();
  });

  useEffect(() => {
    if (!devices) return;

    const newActiveDevice = devices.filter((device) => device.is_active);
    if (newActiveDevice.length !== 1) return;

    setActiveDevice(newActiveDevice[0]);
  }, [devices]);

  const setNewActiveDevice = async (deviceId: string) => {
    if (!sdk) return;

    // TODO: state can be null if no connected device is set, so the typehints are misleading.

    const state = await sdk.player.getPlaybackState();
    await sdk.player.transferPlayback([deviceId]);
    if (state?.is_playing) {
      await startResume(deviceId);
    }

    // TODO: Solve without timeout.
    setTimeout(refreshDevices, 1000);
  };

  const checkAccessToken = async () => {
    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
    const internalSdk = new SpotifyApi(auth);
    if (await internalSdk.getAccessToken()) {
      console.debug("SpotifyContext: AccessToken available");
      setSdk(internalSdk);
    } else {
      console.warn("SpotifyContext: No AccessToken available");
    }
  };

  const login = async () => {
    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
    const internalSdk = new SpotifyApi(auth);
    try {
      const { authenticated } = await internalSdk.authenticate();

      if (authenticated) {
        console.info("SpotifyContext: Successfully authenticated");
        setSdk(internalSdk);
      } else {
        console.error("SpotifyContext: Failed to authenticated");
      }
    } catch (e: Error | unknown) {
      const error = e as Error;
      if (error && error.message && error.message.includes("No verifier found in cache")) {
        console.error(
          "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
          error,
        );
      } else {
        console.error(e);
      }
    }
  };

  const logout = () => {
    sdk?.logOut();
    setSdk(undefined);
  };

  const pause = async () => {
    if (sdk && activeDevice?.id) {
      try {
        await sdk.player.pausePlayback(activeDevice.id);
      } catch (e) {
        if (!(e instanceof SyntaxError)) {
          console.debug("Pause playback error, type was: " + typeof e);
          throw e;
        }
      }
    }
  };

  const startResume = async (deviceId?: string) => {
    if (!sdk) return;

    const id = deviceId ?? activeDevice?.id;
    if (!id) return;

    try {
      await sdk.player.startResumePlayback(id);
    } catch (e) {
      if (!(e instanceof SyntaxError)) {
        console.log(typeof e);
        throw e;
      }
    }
  };

  const getCleanedReleaseDate = async (song: Track, searchFirstRelease: boolean) => {
    const orig_release_date = song.album.release_date;

    const cleanReleaseDate = (date: string) => {
      return date.slice(0, 4);
    };

    if (searchFirstRelease) {
      const searchResult = await sdk?.search(song?.artists[0].name + " " + song?.name, ["track"]);
      const filteredResult = searchResult?.tracks.items.filter((track: Track) => {
        if (track.name.includes(song.name) && track.artists[0].name === song.artists[0].name) {
          return true;
        }
        return false;
      });
      if (filteredResult) {
        return Math.min(...filteredResult.map((track) => parseInt(cleanReleaseDate(track.album.release_date))));
      }
    }
    return cleanReleaseDate(orig_release_date);
  };

  const play = async (playlistId: string, track: Track) => {
    if (sdk && activeDevice?.id) {
      const contextUri = "spotify:playlist:" + playlistId;
      try {
        await sdk.player.startResumePlayback(activeDevice.id, contextUri, undefined, { uri: track.uri });
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
    }
    return false;
  };

  const playPause = async () => {
    if (sdk && activeDevice?.id) {
      const state = await sdk.player.getPlaybackState();
      if (state.is_playing) {
        pause();
      } else {
        startResume();
      }
    }
  };

  const setSongFromPlaylist = async (playlistId: string, position: number) => {
    if (sdk && activeDevice?.id) {
      const playlist = await sdk.playlists.getPlaylist(playlistId);
      if (!playlist?.tracks?.total) {
        console.error("playlist not found " + playlistId);
        return false;
      }
      const playlistItems = await sdk.playlists.getPlaylistItems(playlistId, undefined, undefined, 1, position - 1);
      const cleanedReleaseDate = await getCleanedReleaseDate(playlistItems?.items[0].track, true);
      const song = {
        title: playlistItems?.items[0].track.name,
        artist: playlistItems?.items[0].track.artists[0].name,
        year: cleanedReleaseDate,
        playlistId: playlistId,
        albumCover: playlistItems?.items[0].track.album.images[0].url,
        spotifyTrackId: playlistItems?.items[0].track.id,
      } as Song;

      setCurrentSong(song);

      return play(playlistId, playlistItems?.items[0].track);
    }
    return false;
  };

  const setRandomSongFromPlaylist = async (playlistId: string) => {
    if (sdk && activeDevice?.id) {
      const playlist = await sdk.playlists.getPlaylist(playlistId);
      const randomSong = Math.floor(Math.random() * (playlist?.tracks.total + 1));
      return await setSongFromPlaylist(playlistId, randomSong);
    }
    return false;
  };

  return (
    <SpotifyContext.Provider
      value={{
        login,
        logout,
        connect: {
          devices,
          activeDevice,
          refreshDevices,
          setNewActiveDevice,
        },
        playback: {
          currentSong,
          setCurrentSong,
          pause,
          startResume,
          play,
          playPause,
          setSongFromPlaylist,
          setRandomSongFromPlaylist,
        },
        api: sdk,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
};
