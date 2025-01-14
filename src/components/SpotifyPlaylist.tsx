import React, { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
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

const SpotifyPlaylist: React.FC = () => {
  const [song, setSong] = useState<Track | undefined>();
  const [playbackError, setplaybackError] = useState<string>("");

  const spotify = useSpotify();
  const gameState = useGameState();
  const settings = useSettings();

  const transferPlaybackAsync = async (device_id: string) => {
    await spotify.api?.player.transferPlayback([device_id]);
    setTimeout(async () => {
      spotify?.connect.refreshDevices();
    }, 1000);
  };

  useEffect(() => {
    if (!spotify.connect.devices) {
      spotify?.connect.refreshDevices();
    }
  }, [spotify]);

  useEffect(() => {
    (async () => {
      gameState.setPlaylistId("26zIHVncgI9HmHlgYWwnDi");
      if (!spotify.api) {
        settings.playback.setRepeatSong(undefined);
        return;
      }

      if (settings.playback.repeatSong === undefined) {
        // On first run, init repeat song value
        if (spotify?.connect.devices) {
          const state = await spotify.api.player.getPlaybackState();
          settings.playback.setRepeatSong(state.repeat_state === "track");
        } else {
          console.warn("Could not determine repeat song state");
          settings.playback.setRepeatSong(false);
        }
        return;
      }

      if (spotify?.connect.activeDevice?.id) {
        (async () => {
          try {
            if (settings.playback.repeatSong) {
              await spotify?.api?.player.setRepeatMode("track");
            } else {
              await spotify?.api?.player.setRepeatMode("off");
            }
          } catch (e) {
            if (!(e instanceof SyntaxError)) {
              throw e;
            }
          }
        })();
      }
    })();
  }, [spotify, gameState, settings]);

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
        await spotify.playback.play(gameState.playlistId, nextSong);
      }
      setplaybackError("");
    })();
  };

  const playButtonClick = () => {
    spotify.connect.refreshDevices();
    if (gameState.currentState !== ButtonStateEnum.RevealSong) {
      playNextSong(undefined);
      return;
    }

    if (spotify?.api) {
      if (settings.playback.stopOnReveal) spotify.playback.pause();
      gameState.setPlaySongState();
    }
  };

  const pauseClick = async () => {
    if (spotify?.api) {
      const state = await spotify.api.player.getPlaybackState();
      if (state.is_playing) {
        spotify.playback.pause();
      } else {
        spotify.playback.startResume();
      }
    }
  };

  const title = song?.name;
  const artist = song?.artists[0]?.name;
  const year = song?.album.release_date.slice(0, 4);

  const onDeviceChange = (device_id: string) => {
    transferPlaybackAsync(device_id);
  };

  const selectedDevice = spotify.connect.activeDevice?.id ? spotify.connect.activeDevice.id : "";

  return (
    <div className="grid place-content-center">
      Play on:
      <select value={selectedDevice} onChange={(e) => onDeviceChange(e.target.value)} className="mx-1 w-64 text-center">
        <option key="noDevice" value={""} disabled></option>
        {spotify.connect.devices?.map((device) => (
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
