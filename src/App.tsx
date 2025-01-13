import "./App.css";
import { SpotifyProvider } from "./contexts/Spotify";
import SpotifyAuth from "./components/SpotifyAuth";
import SpotifyPlaylist from "./components/SpotifyPlaylist";
import { SettingsProvider } from "./contexts/Settings";
import { GameStateProvider } from "./contexts/GameState";
/*import QrCodeReader from "./components/QrCodeReader.";
import { QrCodeReaderProvider } from "./contexts/QrCodeReader";*/

function App() {
  return (
    <SettingsProvider>
      <SpotifyProvider>
        <GameStateProvider>
          <div className="flex flex-wrap text-white place-content-center h-full">
            <SpotifyAuth />
            <SpotifyPlaylist />
          </div>
        </GameStateProvider>
      </SpotifyProvider>
    </SettingsProvider>
  );
  /*return (<>
  <QrCodeReaderProvider><QrCodeReader></QrCodeReader></QrCodeReaderProvider>
  </>)*/
}

export default App;
