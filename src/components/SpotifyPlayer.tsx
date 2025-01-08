import { WebPlaybackSDK, useErrorState, useSpotifyPlayer, usePlayerDevice, useWebPlaybackSDKReady } from "react-spotify-web-playback-sdk";
import { useSpotify } from "../contexts/Spotify";
import SpotifyPlaylist from "./SpotifyPlaylist";

const ErrorState = () => {
  const errorState = useErrorState();

  if (errorState === null) return null;

  return <p>Error: {errorState.message}</p>;
};

export const PlayerHeader: React.FC = () => {
  const playerDevice = usePlayerDevice();

  return (<h1>{playerDevice?.device_id}</h1>);
};

const PauseResumeButton = () => {
  const player = useSpotifyPlayer();

  if (player === null) return null;

  return (
    <div>
      <button onClick={() => player.togglePlay()}>Play/Pause</button>
      <button onClick={() => player.activateElement()}>Activate</button>
      {}
    </div>
  );
};

const MyPlayer = () => {
  const webPlaybackSDKReady = useWebPlaybackSDKReady();

  if (!webPlaybackSDKReady) return <div>Loading...</div>;

  return <div>
            <PauseResumeButton />
          </div>;
};


const SpotifyPlayer: React.FC = () => {  
  const spotify = useSpotify();

  if (!spotify?.api) { return null };

  const tokenProvider = async (callback: any) => {
    const token = await spotify.api?.getAccessToken();
    callback(token?.access_token);
  };

  return (
    <WebPlaybackSDK
      initialDeviceName="OpenSongQuiz"
      getOAuthToken={tokenProvider}
      initialVolume={0.5}>
      <MyPlayer />
      <ErrorState />
      <SpotifyPlaylist />
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;