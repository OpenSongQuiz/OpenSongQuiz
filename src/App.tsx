import './App.css'
import { SpotifyConfig } from './types'
import { Scopes } from '@spotify/web-api-ts-sdk'
import SpotifyPlayer from './components/SpotifyPlayer'
import SpotifyPlaylist from './components/SpotifyPlaylist'
import { useSpotify } from './hooks/useSpotify'
import SpotifyAuth from './components/SpotifyAuth'

const spotifyConfig: SpotifyConfig = {
  clientId: '7760f245f5344b5b8f5735c4daf148c0',
  redirectTarget: 'http://localhost:8080',
  scopes: [...Scopes.playlist, ...Scopes.userPlayback]
}

function App() {
  const spotify = useSpotify(spotifyConfig.clientId, spotifyConfig.redirectTarget, spotifyConfig.scopes)

  return (
    <>
        <SpotifyAuth spotify={spotify} />
        <SpotifyPlayer spotify={spotify} />
        <SpotifyPlaylist spotify={spotify} />
    </>
  )
}

export default App
