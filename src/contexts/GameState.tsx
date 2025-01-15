import { createContext, useContext, useState } from "react";

interface GameStateContextProps {
  currentState: number;
  playlistId: string;
  songId: string;
  gameMode: number | undefined,
  setStartState: () => void;
  setRevealSongState: () => void;
  setErrorState: () => void;
  setPlaySongState: () => void;
  setPlaylistId: (playlistId: string) => void;
  setSongId: (songId: string) => void;
  setOnlineMode: () => void,
  setQrCodeMode: () => void,
  isRevealed: () => boolean;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(undefined);

export enum GameStateEnum {
  Start = 0,
  RevealSong = 1,
  ErrorTryAgain = 2,
  PlaySong = 3,
}

export enum GameModeEnum {
  online = 0,
  qrCode = 1,
}

interface GameStateProviderProps {
  children?: React.ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState(GameStateEnum.Start);
  const [gameMode, setGameMode] = useState<number | undefined>(undefined);
  const [playlistId, setPlaylistId] = useState<string>("");
  const [songId, setSongId] = useState<string>("");

  return (
    <GameStateContext.Provider
      value={{
        currentState,
        playlistId,
        songId,
        gameMode,
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
        setOnlineMode: () => {
          setGameMode(GameModeEnum.online)
        },
        setQrCodeMode: () => {
          setGameMode(GameModeEnum.qrCode)
        },
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
