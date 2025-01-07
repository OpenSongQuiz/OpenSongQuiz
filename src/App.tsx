import './App.css'
import SpotifyPlayer from './components/SpotifyPlayer'
import SpotifyPlaylist from './components/SpotifyPlaylist'
import SpotifyAuth from './components/SpotifyAuth'
import { SpotifyProvider } from './contexts/Spotify'
import { useState } from 'react'

function App() {
  const [osqId, setOsqId] = useState<number>(Math.floor(Math.random() * 301))

  return (
    <SpotifyProvider>
      <SpotifyAuth />
      <SpotifyPlayer />
      <SpotifyPlaylist osqId={osqId} />
    </SpotifyProvider>
  )
}

export default App
