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

  //######
  //## Repeat song setting
  //######

  const [isChangingRepeatSong, setIsChangingRepeatSong] = useState<boolean>(false);
  const setRepeatSong = (newRepeatSongState: boolean) => {
    if (!spotify?.api) return;
    const newMode = newRepeatSongState ? "track" : "off";

    setIsChangingRepeatSong(true);
    spotify?.api?.player.setRepeatMode(newMode).then(
      () => {
        settings.playback.setRepeatSong(newRepeatSongState);
      }
    ).catch(err => {
      if (err instanceof SyntaxError) {
        // Fix for https://github.com/spotify/spotify-web-api-ts-sdk/pull/128
        // Assume api call was successful.
        settings.playback.setRepeatSong(newRepeatSongState);
      } else {
        console.log(err);
      }
    }).finally(() => {
      setIsChangingRepeatSong(false);
    });
  }
  // Init setRepeatSong
  useEffect(() => {
    if (!spotify.api) {
      setIsChangingRepeatSong(true);
      return;
    }

    spotify.api.player.getPlaybackState().then(state => {
      settings.playback.setRepeatSong(state.repeat_state === "track");
    }).finally(() => {
      setIsChangingRepeatSong(false);
    })
  }, [spotify]);


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
        label="Stop playback on reveal"
        playbackSettingState={settings.playback.stopOnReveal}
        setPlaybackSetting={settings.playback.setStopOnReveal}
      />
      <PlaybackSetting
        label="Repeat song"
        isLoading={isChangingRepeatSong}
        playbackSettingState={settings.playback.repeatSong}
        setPlaybackSetting={setRepeatSong}
      />
      {hasOwnConnectPlayer ? <SpotifyPlayer></SpotifyPlayer> : <></>}
    </>
  );
};

export default SpotifyPlaylist;
