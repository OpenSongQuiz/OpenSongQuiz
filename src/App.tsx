import './App.css'
import SpotifyPlayer from './components/SpotifyPlayer'
import SpotifyAuth from './components/SpotifyAuth'
import { SpotifyProvider } from './contexts/Spotify'
import SpotifySdkDemo from './components/SpotifySdkDemo'

function App() {
  return (
    <SpotifyProvider>
      <SpotifyAuth />
      <SpotifyPlayer />
      <SpotifySdkDemo />
    </SpotifyProvider>
  )
}

export default App
