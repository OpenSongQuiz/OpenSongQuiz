import './App.css'
import SpotifyAuth from './components/SpotifyAuth'
import SpotifyPlayer from './components/SpotifyPlayer'
import SpotifyPlaylist from './components/SpotifyPlaylist'

function App() {
  return (
    <>
      <SpotifyAuth/>
      <SpotifyPlayer />
      <SpotifyPlaylist/>
    </>
  )
}

export default App
