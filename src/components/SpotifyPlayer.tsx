import {
  WebPlaybackSDK,
  useErrorState,
  useSpotifyPlayer,
  usePlayerDevice,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import { useSpotify } from "../contexts/Spotify";

const ErrorState = () => {
  const errorState = useErrorState();

  if (errorState === null) return null;

  return <p>Error: {errorState.message}</p>;
};

export const PlayerHeader: React.FC = () => {
  const playerDevice = usePlayerDevice();

  return <h1>{playerDevice?.device_id}</h1>;
};

const PauseResumeButton = () => {
  const player = useSpotifyPlayer();

  const activateButtonClick = () => {
    player?.activateElement();
    player?.connect().then(() => {
      console.log("connected");
    });
  };

  return (
    <div>
      {player ? (
        <>
          <button onClick={() => player?.togglePlay()}>Play/Pause</button>
          <button onClick={activateButtonClick}>Activate</button>
        </>
      ) : (
        <></>
      )}

      {}
    </div>
  );
};

const MyPlayer = () => {
  const webPlaybackSDKReady = useWebPlaybackSDKReady();

  if (!webPlaybackSDKReady) return <div>Loading...</div>;

  return (
    <div>
      <PauseResumeButton />
    </div>
  );
};

const SpotifyPlayer: React.FC = () => {
  const spotify = useSpotify();

  if (!spotify?.api) {
    return null;
  }

  const tokenProvider = async (callback: any) => {
    const token = await spotify.api?.getAccessToken();
    callback(token?.access_token);
  };

  return (
    <WebPlaybackSDK initialDeviceName="OpenSongQuiz" getOAuthToken={tokenProvider} initialVolume={0.5}>
      <div className="w-5/6 justify-center">
        <MyPlayer />
        <ErrorState />
      </div>
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;
