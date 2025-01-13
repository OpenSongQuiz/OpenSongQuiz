import "./App.css";
import { SpotifyProvider } from "./contexts/Spotify";
import SpotifyAuth from "./components/SpotifyAuth";
import SpotifyPlaylist from "./components/SpotifyPlaylist";
import { SettingsProvider } from "./contexts/Settings";
/*import QrCodeReader from "./components/QrCodeReader.";
import { QrCodeReaderProvider } from "./contexts/QrCodeReader";*/

function App() {
  return (
    <SettingsProvider>
      <SpotifyProvider>
        <div className="flex flex-wrap text-white place-content-center h-full">
          <SpotifyAuth />
          <SpotifyPlaylist />
        </div>
      </SpotifyProvider>
    </SettingsProvider>
  );
  /*return (<>
  <QrCodeReaderProvider><QrCodeReader></QrCodeReader></QrCodeReaderProvider>
  </>)*/
}

export default App;
