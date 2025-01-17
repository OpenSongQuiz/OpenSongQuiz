import { WebPlaybackSDK, usePlayerDevice } from "react-spotify-web-playback-sdk";
import { useSpotify } from "../../contexts/Spotify";
import { useEffect } from "react";

const MyPlayer: React.FC = () => {
  const spotify = useSpotify();
  const playerDevice = usePlayerDevice();

  useEffect(() => {
    if (!spotify || !playerDevice || playerDevice.status !== "ready") return;

    spotify.connect.setNewActiveDevice(playerDevice.device_id);
  }, [spotify, playerDevice]);

  return <></>;
};

const SpotifyPlayer: React.FC = () => {
  const spotify = useSpotify();

  if (!spotify?.api) {
    return null;
  }

  const tokenProvider = async (callback: (token: string) => void) => {
    const token = await spotify.api?.getAccessToken();
    if (token) {
      callback(token.access_token);
    }
  };

  return (
    <WebPlaybackSDK initialDeviceName="OpenSongQuiz" getOAuthToken={tokenProvider} initialVolume={0.5}>
      <div className="w-5/6 justify-center">
        <MyPlayer />
      </div>
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;
