import { useState } from "react";

import { SettingsContext, debugSettingsProps } from "../../contexts/Settings";

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
