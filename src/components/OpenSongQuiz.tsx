import React from "react";
import { useGameState } from "../contexts/GameState";
import SpotifyAuth from "./spotify/Auth";
import SpotifyPlaylist from "./spotify/Playlist";
import SongInfo from "./SongInfo";
import { useSpotify } from "../contexts/Spotify";
import { useSettings } from "../contexts/Settings";

enum ButtonStateEnum {
  Start = 0,
  RevealSong = 1,
  ErrorTryAgain = 2,
  PlaySong = 3,
}

const GameModeSelection: React.FC = () => {
  const gameState = useGameState();

  return (
    <>
      <div className="grid">
        <h1 className="text-2xl my-2">Welcome to OpenSongQuiz</h1>
        <button onClick={gameState.setOnlineMode}>Play online</button>
        <button onClick={gameState.setQrCodeMode}>Play with Qr Codes</button>
      </div>
    </>
  );
};

const OpenSongQuiz: React.FC = () => {
  const gameState = useGameState();
  const spotify = useSpotify();
  const settings = useSettings();

  const playNextSong = async (nextOsqId: number | undefined) => {
    (async () => {
      gameState.setRevealSongState();
      if (!nextOsqId) {
        await spotify.playback.setRandomSongFromPlaylist(gameState.playlistId);
      } else {
        await spotify.playback.setSongFromPlaylist(gameState.playlistId, nextOsqId);
      }
    })();
  };

  const playButtonClick = () => {
    if (gameState.currentState !== ButtonStateEnum.RevealSong) {
      playNextSong(undefined);
      return;
    }

    if (spotify?.api) {
      if (settings.playback.stopOnReveal) spotify.playback.pause();
      gameState.setPlaySongState();
    }
  };

  return (
    <>
      <div className="flex flex-wrap text-white place-content-center h-full">
        {!spotify.api?.getAccessToken() ? (
          <SpotifyAuth />
        ) : gameState.gameMode !== undefined ? (
          <div className="grid place-content-center">
            <SpotifyPlaylist />
            <SongInfo />
            <button onClick={spotify.playback.playPause}>Play/Pause</button>
            <button onClick={playButtonClick}>{ButtonStateEnum[gameState.currentState]}</button>
          </div>
        ) : (
          <GameModeSelection />
        )}
      </div>
    </>
  );
};

export default OpenSongQuiz;
