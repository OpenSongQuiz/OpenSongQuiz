import React, { useCallback, useEffect, useState } from "react";
import { Device, Track } from "@spotify/web-api-ts-sdk";
import { useSpotify } from "../contexts/Spotify";
import { useSettings } from "../contexts/Settings";
import PlaybackSetting from "./PlaybackSetting";
import SongInfo from "./SongInfo";
import { useGameState } from "../contexts/GameState";

enum ButtonStateEnum {
  Start = 0,
  RevealSong = 1,
  ErrorTryAgain = 2,
  PlaySong = 3,
}

interface Playback {
  devices?: Device[];
  selected: string;
}

const SpotifyPlaylist: React.FC = () => {
  const [song, setSong] = useState<Track | undefined>();
  const [playbackError, setplaybackError] = useState<string>("");
  const [playback, setPlayback] = useState<Playback | null>();

  const spotify = useSpotify();
  const gameState = useGameState();
  const settings = useSettings();

  const setAvailableDevicesAsync = useCallback(async () => {
    const playback = { selected: "" } as Playback;
    const devices = await spotify.api?.player.getAvailableDevices();
    playback.devices = devices?.devices;
    const selected = playback.devices
      ? playback.devices[playback.devices.findIndex((device) => device.is_active === true)]?.id
      : null;
    playback.selected = selected ? selected : "";
    setPlayback(playback);
  }, [spotify.api]);

  const transfertPlaybackAsync = async (device_id: string) => {
    await spotify.api?.player.transferPlayback([device_id]);
    setTimeout(async () => {
      await setAvailableDevicesAsync();
    }, 1000);
  };

  useEffect(() => {
    setAvailableDevicesAsync();
  }, [setAvailableDevicesAsync, spotify.api]);

  useEffect(() => {
    (async () => {
      gameState.setPlaylistId("26zIHVncgI9HmHlgYWwnDi");
      if (!spotify.api) {
        settings.playback.setRepeatSong(undefined);
        return;
      }

      if (settings.playback.repeatSong === undefined) {
        // On first run, init repeat song value
        if (playback?.selected) {
          const state = await spotify.api.player.getPlaybackState();
          settings.playback.setRepeatSong(state.repeat_state === "track");
        } else {
          console.error("Could not determine repeat song state");
          settings.playback.setRepeatSong(false);
        }
        return;
      }

      if (settings.playback.repeatSong) {
        spotify.api.player.setRepeatMode("track");
      } else {
        spotify.api.player.setRepeatMode("off");
      }
    })();
  }, [spotify.api, settings, playback]);

  if (!spotify.api) return null;

  const playNextSong = (nextOsqId: number | undefined) => {
    (async () => {
      const playlist = await spotify.api?.playlists.getPlaylist(gameState.playlistId);
      if (!playlist?.tracks?.total) {
        console.error("playlist not found " + gameState.playlistId);
        return;
      }
      gameState.setRevealSongState();
      nextOsqId = nextOsqId ? nextOsqId : Math.floor(Math.random() * (playlist?.tracks.total + 1));
      const playlistItems = await spotify.api?.playlists.getPlaylistItems(
        gameState.playlistId,
        undefined,
        undefined,
        1,
        nextOsqId - 1,
      );
      const nextSong = playlistItems?.items[0].track;
      setSong(nextSong);
      if (nextSong) {
        const availableDevices = (await spotify.api?.player.getAvailableDevices())?.devices;
        const device = availableDevices?.filter((session) => session.is_active === true);
        if (device && device.length > 0 && device[0].id) {
          await spotify.api?.player.startResumePlayback(
            device[0].id,
            "spotify:playlist:" + gameState.playlistId,
            undefined,
            {
              uri: nextSong.uri,
            },
          );
        } else {
          setplaybackError("Spotify player not yet ready");
          gameState.setErrorState();
          return;
        }
      }
      setplaybackError("");
    })();
  };

  const playButtonClick = () => {
    setAvailableDevicesAsync();
    if (gameState.currentState !== ButtonStateEnum.RevealSong) {
      playNextSong(undefined);
      return;
    }

    if (spotify?.api) {
      if (settings.playback.stopOnReveal && playback?.selected) spotify.api.player.pausePlayback(playback?.selected);
      gameState.setPlaySongState();
    }
  };

  const pauseClick = async () => {
    if (spotify?.api && playback?.selected) {
      const state = await spotify.api.player.getPlaybackState();
      if (state.is_playing) {
        spotify.api.player.pausePlayback(playback.selected);
      } else {
        spotify.api.player.startResumePlayback(playback.selected);
      }
    }
  };

  const title = song?.name;
  const artist = song?.artists[0]?.name;
  const year = song?.album.release_date.slice(0, 4);

  const onDeviceChange = (device_id: string) => {
    transfertPlaybackAsync(device_id);
  };

  return (
    <div className="grid place-content-center">
      Play on:
      <select
        value={playback?.selected}
        onChange={(e) => onDeviceChange(e.target.value)}
        className="mx-1 w-64 text-center"
      >
        {playback?.devices?.map((device) => (
          <option key={device.id} value={device.id?.toString()}>
            {device.name}
          </option>
        ))}
      </select>
      <PlaybackSetting
        label={"Stop playback on reveal"}
        getPlaybackSetting={() => {
          return settings.playback.stopOnReveal;
        }}
        setPlaybackSetting={settings.playback.setStopOnReveal}
      />
      <PlaybackSetting
        label={"Repeat song"}
        getPlaybackSetting={() => {
          return settings.playback.repeatSong;
        }}
        setPlaybackSetting={settings.playback.setRepeatSong}
      />
      <br />
      <SongInfo hidden={gameState.isRevealed()} artist={artist} title={title} year={year} />
      <div>{playbackError}</div>
      <button onClick={playButtonClick}>{ButtonStateEnum[gameState.currentState]}</button>
      <button onClick={pauseClick}>Play/Pause</button>
    </div>
  );
};

export default SpotifyPlaylist;
