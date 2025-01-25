import { createContext, useContext } from "react";

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

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
