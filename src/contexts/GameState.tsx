import { createContext, SetStateAction, useContext, useState } from "react";
import playlists from "../data/playlists.json";
import { GameStates } from "../types/OpenSongQuiz";

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

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useSettings must be used within a GameStateProvider");
  }
  return context;
};
