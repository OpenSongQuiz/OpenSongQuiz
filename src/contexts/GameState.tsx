import { createContext, SetStateAction, useContext, useEffect, useState } from "react";
import playlists from "../data/playlists.json";
import { GameStateEnum } from "../types/OpenSongQuiz";

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

const GameStateContext = createContext<GameStateContextProps | undefined>(undefined);

interface GameStateProviderProps {
  children?: React.ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState(GameStateEnum.Start);
  const [gameMode, setGameMode] = useState<number | undefined>(undefined);
  const [playlistId, setPlaylistId] = useState<string>("");
  const [songId, setSongId] = useState<string>("");

  useEffect(() => {
    if (!playlistId) {
      setPlaylistId(playlists.playlists[0].spotifyId);
    }
  }, [playlistId]);

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

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useSettings must be used within a GameStateProvider");
  }
  return context;
};
