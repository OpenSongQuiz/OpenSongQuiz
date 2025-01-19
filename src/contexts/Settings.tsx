import { createContext, useContext, useState } from "react";

export interface debugSettingsProps {
  enabled: boolean;
}

export interface SettingsContextProps {
  debugSettings: debugSettingsProps;
  setDebugSettings: (settings: debugSettingsProps) => void;
  playback: {
    repeatSong: boolean;
    stopOnReveal: boolean;
    setRepeatSong: (arg0: boolean) => void;
    setStopOnReveal: (arg0: boolean) => void;
  };
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

interface SettingsProviderProps {
  children?: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [repeatSong, setRepeatSong] = useState<boolean>(false);
  const [stopOnReveal, setStopOnReveal] = useState<boolean>(true);
  const [debugSettings, setDebugSettings] = useState<debugSettingsProps>({ enabled: false });

  return (
    <SettingsContext.Provider
      value={{
        debugSettings: debugSettings,
        setDebugSettings,
        playback: {
          repeatSong: repeatSong,
          stopOnReveal: stopOnReveal,
          setRepeatSong: (arg0: boolean) => setRepeatSong(arg0),
          setStopOnReveal: (arg0: boolean) => setStopOnReveal(arg0),
        },
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
