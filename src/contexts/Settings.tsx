import { createContext, useContext, useState } from "react";

export interface SettingsContextProps {
  playback: {
    repeatSong: boolean | undefined;
    stopOnReveal: boolean | undefined;
    setRepeatSong: (arg0: boolean | undefined) => void;
    setStopOnReveal: (arg0: boolean | undefined) => void;
  };
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

interface SettingsProviderProps {
  children?: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [repeatSong, setRepeatSong] = useState<boolean | undefined>(false);
  const [stopOnReveal, setStopOnReveal] = useState<boolean | undefined>(true);

  const playback = {
    repeatSong: repeatSong,
    stopOnReveal: stopOnReveal,
    setRepeatSong: (arg0: boolean | undefined) => setRepeatSong(arg0),
    setStopOnReveal: (arg0: boolean | undefined) => setStopOnReveal(arg0),
  };

  return (
    <SettingsContext.Provider
      value={{
        playback: playback,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
