import React, { useEffect, useState } from "react";
import { useSpotify } from "../../contexts/Spotify";
import { useSettings } from "../../contexts/Settings";
import PlaybackSetting from "./../PlaybackSetting";
import { useGameState } from "../../contexts/GameState";
import SpotifyPlayer from "./Player";
import playlists from "../../data/playlists.json";

const SpotifyPlaylist: React.FC = () => {
  const [hasOwnConnectPlayer, setHasOwnConnectPlayer] = useState<boolean>(false);

  const spotify = useSpotify();
  const gameState = useGameState();
  const settings = useSettings();

  useEffect(() => {
    (async () => {
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

  const ownPlayerKey = "ownPlayer";
  const onDeviceChange = (deviceId: string) => {
    if (deviceId === ownPlayerKey) {
      setHasOwnConnectPlayer(true);
      return;
    }
    spotify.connect.setNewActiveDevice(deviceId);
  };

  const onPlaylistChange = (playlistId: string) => {
    gameState.setPlaylistId(playlistId);
  };

  const selectedDevice = spotify.connect.activeDevice?.id ? spotify.connect.activeDevice.id : "";

  // TODO: Play on select input should indicate loading while chaning the device

  return (
    <>
      Play on:
      <select value={selectedDevice} onChange={(e) => onDeviceChange(e.target.value)} className="mx-1 w-64 text-center">
        {selectedDevice === "" ? <option key="noDevice" value={""} disabled></option> : <></>}
        {spotify.connect.devices?.map((device) => (
          <option key={device.id} value={device.id?.toString()}>
            {device.name}
          </option>
        ))}
        {!hasOwnConnectPlayer ? (
          <option key={ownPlayerKey} value={ownPlayerKey}>
            Create new device
          </option>
        ) : (
          <></>
        )}
      </select>
      Playlist
      <select
        value={gameState.playlistId}
        onChange={(e) => onPlaylistChange(e.target.value)}
        className="mx-1 w-64 text-center"
      >
        {playlists.playlists.map((playlist) => (
          <option key={playlist.spotifyId} value={playlist.spotifyId}>
            {playlist.name}
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
      {hasOwnConnectPlayer ? <SpotifyPlayer></SpotifyPlayer> : <></>}
    </>
  );
};

export default SpotifyPlaylist;
