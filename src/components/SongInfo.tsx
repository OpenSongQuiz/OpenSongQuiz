import React, { useEffect } from "react";
import { useSpotify } from "../contexts/Spotify";
import { useQrCodeReader } from "../contexts/QrCodeReader";
import { useGameState } from "../contexts/GameState";
import { GameModesEnum, GameStateEnum } from "../types/OpenSongQuiz";

const SongInfo: React.FC = () => {
  const spotify = useSpotify();
  const reader = useQrCodeReader();
  const gameState = useGameState();

  const title = spotify.playback.currentSong?.title;
  const artist = spotify.playback.currentSong?.artist;
  const year = spotify.playback.currentSong?.year;

  useEffect(() => {
    if (gameState.gameMode === GameModesEnum.qrCode && !gameState.isRevealed()) {
      reader.decodeOnce();
    }
  }, [gameState, reader]);

  return (
    <div className="bg-[#2a2a2a] rounded-3xl size-80 my-2">
      <div
        id="song-info"
        className={"grid " + (gameState.isRevealed() ? "" : "hidden") + " size-full text-center place-items-center"}
      >
        <p className="text-xl">{title}</p>
        <p className="text-3xl">{year}</p>
        <p className="text-xl">{artist}</p>
      </div>
      {gameState.currentState === GameStateEnum.QrCodeScan ? (
        <div className={"color-white " + (!gameState.isRevealed() && !reader?.result ? "" : "hidden")}>
          <video id="video" ref={reader.videoRef} className="bg-scroll h-100 w-100" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SongInfo;
