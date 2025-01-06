import { WebPlaybackSDK, usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import useSpotifyAuth from "../hooks/SpotifyAuth";

const SongTitle: React.FC = () => {
  const playbackState = usePlaybackState();

  if (playbackState === null) return null;


  return <p>Current song: {playbackState.track_window.current_track.name}</p>;
};

const PauseResumeButton = () => {
  const player = useSpotifyPlayer();

  if (player === null) return null;

  return (
    <div>
      <button onClick={() => player.pause()}>pause</button>
      <button onClick={() => player.resume()}>resume</button>
    </div>
  );
};

const SpotifyPlayer: React.FC = () => {

  const { accessToken } = useSpotifyAuth();

  return (
    <>
      {accessToken ? (
        <WebPlaybackSDK
          initialDeviceName="OpenSongQuiz"
          getOAuthToken={() => accessToken}
          initialVolume={0.5}>
          <PauseResumeButton />
          <SongTitle />
        </WebPlaybackSDK>
      ) : (<div>...</div>)
      }
    </>

  );
};

export default SpotifyPlayer;