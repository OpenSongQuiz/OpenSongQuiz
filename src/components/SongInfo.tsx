import React, { useEffect } from "react";
import { useSpotify } from "../contexts/Spotify";
import { useQrCodeReader } from "../contexts/QrCodeReader";
import { useGameState } from "../contexts/GameState";
import { GameModesEnum, GameStateEnum } from "../types/OpenSongQuiz";
import logo from "../../Logo.png";

const SongInfo: React.FC = () => {
  const spotify = useSpotify();
  const reader = useQrCodeReader();
  const gameState = useGameState();

  const title = spotify.playback.currentSong?.title;
  const artist = spotify.playback.currentSong?.artist;
  const year = spotify.playback.currentSong?.year;

  useEffect(() => {
    if (gameState.gameMode === GameModesEnum.qrCode && gameState.currentState === GameStateEnum.QrCodeScan) {
      reader.decodeOnce();
    }
  }, [gameState, reader]);

  return (
    <div className="bg-[#2a2a2a] rounded-3xl size-80 my-2 overflow-hidden block">
      <div
        id="song-info"
        className={
          "grid " +
          (gameState.currentState === GameStateEnum.Revealed ? "" : "hidden") +
          " size-full text-center place-items-center"
        }
      >
        <p className="text-xl">{artist}</p>
        <p className="text-3xl">{year}</p>
        <p className="text-xl">{title}</p>
      </div>
      {gameState.currentState === GameStateEnum.QrCodeScan ? (
        <video id="video" ref={reader.videoRef} className="size-80" />
      ) : (
        <></>
      )}
      {gameState.currentState === GameStateEnum.SongPlaying || gameState.currentState === GameStateEnum.Start ? (
        <img src={logo}></img>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SongInfo;
