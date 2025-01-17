import React, { useCallback, useEffect } from "react";
import { useGameState } from "../contexts/GameState";
import SpotifyAuth from "./spotify/Auth";
import SpotifyPlaylist from "./spotify/Playlist";
import SongInfo from "./SongInfo";
import { useSpotify } from "../contexts/Spotify";
import { useSettings } from "../contexts/Settings";
import { useQrCodeReader } from "../contexts/QrCodeReader";
import { GameModesEnum, GameStateEnum } from "../types/OpenSongQuiz";

const PlayButtonStates = [
  { gameState: GameStateEnum.Start, label: "Start Game", disabled: false },
  { gameState: GameStateEnum.Revealed, label: "Continue", disabled: false },
  { gameState: GameStateEnum.ErrorTryAgain, label: "Error: Please Retry", disabled: false },
  { gameState: GameStateEnum.SongPlaying, label: "Reveal song", disabled: false },
  { gameState: GameStateEnum.QrCodeScan, label: "Scan Your QR Code", disabled: true },
];

const GameModeSelection: React.FC = () => {
  const gameState = useGameState();

  return (
    <>
      <div className="grid">
        <h1 className="text-2xl my-2">Welcome to OpenSongQuiz</h1>
        <button onClick={() => gameState.setGameMode(GameModesEnum.online)}>Play online</button>
        <button onClick={() => gameState.setGameMode(GameModesEnum.qrCode)}>Play with Qr Codes</button>
      </div>
    </>
  );
};

const OpenSongQuiz: React.FC = () => {
  const gameState = useGameState();
  const spotify = useSpotify();
  const settings = useSettings();
  const qrCodeReader = useQrCodeReader();

  const playNextSong = useCallback(
    async (playlistId: string, songPosition: number | undefined) => {
      return !songPosition
        ? await spotify.playback.setRandomSongFromPlaylist(playlistId)
        : await spotify.playback.setSongFromPlaylist(playlistId, songPosition);
    },
    [spotify],
  );

  // In QrCodeMode play song from qrCode
  useEffect(() => {
    if (gameState.currentState === GameStateEnum.QrCodeScan && qrCodeReader.result !== undefined) {
      const result = qrCodeReader.result;
      console.debug(result);
      qrCodeReader.resetResult();
      gameState.setGameState(GameStateEnum.SongPlaying);
      gameState.setPlaylistId(result.playlistId);
      playNextSong(result.playlistId, result.playlistPosition);
    }
  }, [gameState, qrCodeReader, playNextSong]);

  const playButtonClick = async () => {
    if (
      gameState.currentState === GameStateEnum.Start ||
      gameState.currentState === GameStateEnum.Revealed ||
      gameState.currentState === GameStateEnum.ErrorTryAgain
    ) {
      if (gameState.gameMode === GameModesEnum.qrCode) {
        gameState.setGameState(GameStateEnum.QrCodeScan);
      } else {
        gameState.setGameState(GameStateEnum.SongPlaying);
        const songPlaying = await playNextSong(gameState.playlistId, undefined);
        if (!songPlaying) gameState.setGameState(GameStateEnum.ErrorTryAgain);
      }
    } else if (gameState.currentState === GameStateEnum.SongPlaying) {
      if (settings.playback.stopOnReveal) spotify.playback.pause();
      gameState.setGameState(GameStateEnum.Revealed);
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
            <button onClick={playButtonClick} disabled={PlayButtonStates[gameState.currentState].disabled}>
              {PlayButtonStates[gameState.currentState].label}
            </button>
          </div>
        ) : (
          <GameModeSelection />
        )}
      </div>
    </>
  );
};

export default OpenSongQuiz;
