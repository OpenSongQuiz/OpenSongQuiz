import React, { useCallback, useEffect } from "react";
import { useGameState } from "../contexts/GameState";
import SpotifyAuth from "./spotify/Auth";
import SpotifyPlaylist from "./spotify/Playlist";
import SongInfo from "./SongInfo";
import { useSpotify } from "../contexts/Spotify";
import { useSettings } from "../contexts/Settings";
import { useQrCodeReader } from "../contexts/QrCodeReader";
import { GameModes as GameModes, GameStates as GameStates } from "../types/OpenSongQuiz";
import wrench from "../data/wrench.svg"

const PlayButtonStates = [
  { gameState: GameStates.Start, label: "Start Game", disabled: false },
  { gameState: GameStates.Revealed, label: "Continue", disabled: false },
  { gameState: GameStates.ErrorTryAgain, label: "Error: Please Retry", disabled: false },
  { gameState: GameStates.SongPlaying, label: "Reveal song", disabled: false },
  { gameState: GameStates.QrCodeScan, label: "Scan Your QR Code", disabled: true },
];

const GameModeSelection: React.FC = () => {
  const gameState = useGameState();
  const settings = useSettings();

  const toggleDebugMode = () => {
    settings.setDebugSettings({...settings.debugSettings, enabled: !settings.debugSettings.enabled});
  }

  const bgColor = settings.debugSettings.enabled ? "bg-lime-400" : "bg-slate-500";

  return (
    <>
      <button className={bgColor + " absolute top-1 left-1 bg-slate-500 position-sticky rounded-full p-2"} onClick={toggleDebugMode}>
        <img src={wrench} width={"24px"}></img>
      </button>
      <div className="grid">
        <h1 className="text-2xl my-2">Welcome to OpenSongQuiz</h1>
        <button onClick={() => gameState.setGameMode(GameModes.online)}>Play online</button>
        <button onClick={() => gameState.setGameMode(GameModes.qrCode)}>Play with Qr Codes</button>
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
    if (gameState.currentState === GameStates.QrCodeScan && qrCodeReader.result !== undefined) {
      const result = qrCodeReader.result;
      console.debug(result);
      qrCodeReader.resetResult();
      gameState.setGameState(GameStates.SongPlaying);
      gameState.setPlaylistId(result.playlistId);
      playNextSong(result.playlistId, result.playlistPosition);
    }
  }, [gameState, qrCodeReader, playNextSong]);

  const playButtonClick = async () => {
    if (
      gameState.currentState === GameStates.Start ||
      gameState.currentState === GameStates.Revealed ||
      gameState.currentState === GameStates.ErrorTryAgain
    ) {
      if (gameState.gameMode === GameModes.qrCode) {
        gameState.setGameState(GameStates.QrCodeScan);
      } else {
        gameState.setGameState(GameStates.SongPlaying);
        const songPlaying = await playNextSong(gameState.playlistId, undefined);
        if (!songPlaying) gameState.setGameState(GameStates.ErrorTryAgain);
      }
    } else if (gameState.currentState === GameStates.SongPlaying) {
      if (settings.playback.stopOnReveal) spotify.playback.pause();
      const nextGameState = gameState.gameMode === GameModes.qrCode && !settings.debugSettings.enabled ? GameStates.QrCodeScan : GameStates.Revealed;
      gameState.setGameState(nextGameState);
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
