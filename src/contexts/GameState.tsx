import { createContext, useContext, useState } from "react";

interface GameStateContextProps {
  currentState: number;
  playlistId: string;
  songId: string;
  setStartState: () => void;
  setRevealSongState: () => void;
  setErrorState: () => void;
  setPlaySongState: () => void;
  setPlaylistId: (playlistId: string) => void;
  setSongId: (songId: string) => void;
  isRevealed: () => boolean;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(undefined);

export enum GameStateEnum {
  Start = 0,
  RevealSong = 1,
  ErrorTryAgain = 2,
  PlaySong = 3,
}

interface GameStateProviderProps {
  children?: React.ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState(GameStateEnum.Start);
  const [playlistId, setPlaylistId] = useState<string>("");
  const [songId, setSongId] = useState<string>("");

  return (
    <GameStateContext.Provider
      value={{
        currentState,
        playlistId,
        songId,
        setStartState: () => {
          setCurrentState(GameStateEnum.Start);
        },
        setRevealSongState: () => {
          setCurrentState(GameStateEnum.RevealSong);
        },
        setErrorState: () => {
          setCurrentState(GameStateEnum.ErrorTryAgain);
        },
        setPlaySongState: () => {
          setCurrentState(GameStateEnum.PlaySong);
        },
        setPlaylistId: setPlaylistId,
        setSongId: setSongId,
        isRevealed: () => {
          return currentState < 3;
        },
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useSettings must be used within a GameStateProvider");
  }
  return context;
};
