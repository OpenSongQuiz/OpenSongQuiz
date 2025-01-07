import { WebPlaybackSDK, useErrorState, usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import { SpotifyComponent } from "../types";
import { useCallback } from "react";

const SongTitle: React.FC = () => {
  const playbackState = usePlaybackState();

  if (playbackState === null) return ;


  return <p>Current song: {playbackState.track_window.current_track.name}</p>;
};

const ErrorState = () => {
  const errorState = useErrorState();

  if (errorState === null) return null;

  return <p>Error: {errorState.message}</p>;
};

const PauseResumeButton = () => {
  const player = useSpotifyPlayer();
  (async () => {const state = await player?.getCurrentState(); console.log(state)})();

  if (player === null) return null;

  return (
    <div>
      <button onClick={() => player.pause()}>pause</button>
      <button onClick={() => player.resume()}>resume</button>
    </div>
  );
};

const SpotifyPlayer: React.FC<SpotifyComponent> = ({spotify}) => {
  const token = spotify?.getAccessToken()
  
  const getOAuthToken = useCallback(callback => {
    if (token) {
      callback(token)
    }
  }, []);

  return (
        <WebPlaybackSDK
          initialDeviceName="OpenSongQuiz"
          getOAuthToken={getOAuthToken}
          initialVolume={0.5}
          connectOnInitialized={true}>
          <PauseResumeButton />
          <SongTitle />
          <ErrorState />
        </WebPlaybackSDK>
      
  );
};

export default SpotifyPlayer;