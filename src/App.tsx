import './App.css'
import {SpotifyAuthProvider} from './contexts/SpotifyAuth'
import SpotifyAuth from './components/SpotifyAuth'
import SpotifyPlayer from './components/SpotifyPlayer'
import SpotifyPlaylist from './components/SpotifyPlaylist'

function App() {
  return (
    <>
      <SpotifyAuthProvider>
        <>
        <SpotifyAuth/>
        <SpotifyPlayer />
        <SpotifyPlaylist/>
        </>
      </SpotifyAuthProvider>
    </>
  )
}

export default App
