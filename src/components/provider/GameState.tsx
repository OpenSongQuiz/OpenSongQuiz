import { useState } from "react";
import playlists from "../../data/playlists.json";
import { GameStates } from "../../types/OpenSongQuiz";
import { GameStateContext } from "../../contexts/GameState";

interface GameStateProviderProps {
  children?: React.ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState(GameStates.Start);
  const [gameMode, setGameMode] = useState<number | undefined>(undefined);
  const [playlistId, setPlaylistId] = useState<string>(playlists.playlists[0].spotifyId);
  const [songId, setSongId] = useState<string>("");

  return (
    <GameStateContext.Provider
      value={{
        currentState,
        playlistId,
        songId,
        gameMode,
        setGameState: (state) => {
          setCurrentState(state);
        },
        setGameMode: (mode) => {
          setGameMode(mode);
        },
        setPlaylistId: setPlaylistId,
        setSongId: setSongId,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};