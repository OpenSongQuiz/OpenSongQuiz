import "./App.css";
import { SpotifyProvider } from "./contexts/Spotify";
import { SettingsProvider } from "./contexts/Settings";
import { GameStateProvider } from "./contexts/GameState";
import OpenSongQuiz from "./components/OpenSongQuiz";
import { QrCodeReaderProvider } from "./contexts/QrCodeReader";

function App() {
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
