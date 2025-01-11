import "./App.css";
import { SpotifyProvider } from "./contexts/Spotify";
import SpotifyAuth from "./components/SpotifyAuth";
import SpotifyPlaylist from "./components/SpotifyPlaylist";

function App() {
  return (
    <SpotifyProvider>
      <div className="flex flex-wrap text-white place-content-center h-full">
        <SpotifyAuth />
        <SpotifyPlaylist />
      </div>
    </SpotifyProvider>
  );
}

export default App;
