import React, { useEffect } from "react";
import { useSpotify } from "../contexts/Spotify";
import { useQrCodeReader } from "../contexts/QrCodeReader";
import { GameModesEnum, useGameState } from "../contexts/GameState";

const SongInfo: React.FC = () => {
  const spotify = useSpotify();
  const reader = useQrCodeReader();
  const gameState = useGameState();

  const title = spotify.playback.currentSong?.title;
  const artist = spotify.playback.currentSong?.artist;
  const year = spotify.playback.currentSong?.year;

  useEffect(() => {
    reader.decodeOnce();
  }, [reader]);

  return (
    <div className="bg-[#2a2a2a] rounded-3xl size-80 my-2">
      <div
        id="song-info"
        className={"grid " + (gameState.isRevealed() ? "hidden" : "") + " size-full text-center place-items-center"}
      >
        <p className="text-xl">{title}</p>
        <p className="text-3xl">{year}</p>
        <p className="text-xl">{artist}</p>
      </div>
      {gameState.gameMode === GameModesEnum.qrCode ? (
        <div className={"color-white " + (gameState.isRevealed() && !reader?.result ? "" : "hidden")}>
          <video id="video" ref={reader.videoRef} className="bg-scroll h-100 w-100" />
          <p>
            <span>Last result:</span>
            <span>{reader.result}</span>
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SongInfo;
