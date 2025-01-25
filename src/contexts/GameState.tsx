import { createContext, SetStateAction, useContext } from "react";

interface GameStateContextProps {
  currentState: number;
  playlistId: string;
  songId: string;
  gameMode: number | undefined;
  setGameState: (state: SetStateAction<number>) => void;
  setGameMode: (mode: number | undefined) => void;
  setPlaylistId: (playlistId: string) => void;
  setSongId: (songId: string) => void;
}

export const GameStateContext = createContext<GameStateContextProps | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
