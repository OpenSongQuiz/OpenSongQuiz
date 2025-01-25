import "./App.css";
import { SpotifyProvider } from "./components/provider/Spotify";
import { SettingsProvider } from "./components/provider/Settings";
import { GameStateProvider } from "./components/provider/GameState";
import OpenSongQuiz from "./components/OpenSongQuiz";
import { QrCodeReaderProvider } from "./components/provider/QrCodeReader";
import { useEffect, useState } from "react";

function App() {
  // Prevent screen locking
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | undefined>();

  useEffect(() => {
    if (!wakeLock) {
      (async () => {
        try {
          const wl = await navigator.wakeLock.request("screen");
          setWakeLock(wl);
        } catch (err) {
          if (err instanceof Error) {
            // the wake lock request fails - usually system related, such being low on battery
            console.log(`${err.name}, ${err.message}`);
          }
        }
      })();
    }
  }, [wakeLock]);

  return (
    <SettingsProvider>
      <SpotifyProvider>
        <GameStateProvider>
          <QrCodeReaderProvider>
            <OpenSongQuiz />
          </QrCodeReaderProvider>
        </GameStateProvider>
      </SpotifyProvider>
    </SettingsProvider>
  );
}

export default App;
