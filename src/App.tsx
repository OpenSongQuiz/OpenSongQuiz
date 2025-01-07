import './App.css'
import SpotifyPlayer from './components/SpotifyPlayer'
import SpotifyPlaylist from './components/SpotifyPlaylist'
import SpotifyAuth from './components/SpotifyAuth'
import { SpotifyProvider } from './contexts/Spotify'

function App() {
  return (
    <SpotifyProvider>
      <SpotifyAuth />
      <SpotifyPlayer />
      <SpotifyPlaylist />
    </SpotifyProvider>
  )
}

export default App
