import "./App.css";
import { SpotifyProvider } from "./contexts/Spotify";
import { SettingsProvider } from "./contexts/Settings";
import { GameStateProvider } from "./contexts/GameState";
import OpenSongQuiz from "./components/OpenSongQuiz";
/*import QrCodeReader from "./components/QrCodeReader.";
import { QrCodeReaderProvider } from "./contexts/QrCodeReader";*/

function App() {
  return (
    <SettingsProvider>
      <SpotifyProvider>
        <GameStateProvider>
          <OpenSongQuiz />
        </GameStateProvider>
      </SpotifyProvider>
    </SettingsProvider>
  );
  /*return (<>
  <QrCodeReaderProvider><QrCodeReader></QrCodeReader></QrCodeReaderProvider>
  </>)*/
}

export default App;
