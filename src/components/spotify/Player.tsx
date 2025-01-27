import { WebPlaybackSDK, usePlayerDevice } from "react-spotify-web-playback-sdk";
import { useSpotify } from "../../contexts/Spotify";
import React, { useEffect, useState } from "react";


interface MyPlayerProps {
  setIsLoading: (ar0: boolean) => void;
  setLoadingError: () => void;
}

const MyPlayer: React.FC<MyPlayerProps> = ({ setIsLoading, setLoadingError }) => {
  const spotify = useSpotify();
  const playerDevice = usePlayerDevice();

  useEffect(() => {
    setIsLoading(playerDevice?.status !== "ready");
    if (!playerDevice || playerDevice.status !== "ready") return;

    spotify.connect.setNewActiveDevice(playerDevice.device_id);

    // TODO: adding spotify.connect as dependency breaks the application because setNewActiveDevice refresehes spotify.connect
    // Try to separate the spotify.connect actions from state(?)
  }, [playerDevice, setIsLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (playerDevice?.status !== "ready") setLoadingError();
    }, 15000);
    return () => clearTimeout(timer);
  }, [playerDevice]);

  return <></>;
};


interface SpotifyPlayerProps {
  setIsLoading: (ar0: boolean) => void;
  setLoadingError: () => void;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ setIsLoading, setLoadingError }) => {
  const spotify = useSpotify();

  if (!spotify?.api?.getAccessToken()) {
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
        <MyPlayer setIsLoading={setIsLoading} setLoadingError={setLoadingError} />
      </div>
    </WebPlaybackSDK>
  );
};

const SpotifyPlayerSelection: React.FC = () => {
  const [hasOwnConnectPlayer, setHasOwnConnectPlayer] = useState<boolean>(false);
  const [ownConnectPlayerIsLoading, setOwnConnectPlayerIsLoading] = useState<boolean>(false);

  const spotify = useSpotify();

  useEffect(() => {
    if (!spotify.connect.devices) {
      spotify?.connect.refreshDevices();
    }
  }, [spotify]);

  if (!spotify.api) return null;

  const ownPlayerKey = "ownPlayer";
  const onDeviceChange = (deviceId: string) => {
    if (deviceId === ownPlayerKey) {
      setHasOwnConnectPlayer(true);
      return;
    }
    spotify.connect.setNewActiveDevice(deviceId);
  };

  const handleErrorInPlayerLoading = () => {
    setHasOwnConnectPlayer(false);
    setOwnConnectPlayerIsLoading(false);
    // TODO: Proper display of error to user
    console.error("Could not load Player SDK");
  };

  const selectedDevice = spotify.connect.activeDevice?.id ? spotify.connect.activeDevice.id : "";

  const showLoading = spotify.connect.isChangingDevice || ownConnectPlayerIsLoading

  return (
    <>
      Play on:
      <select disabled={showLoading} value={selectedDevice} onChange={(e) => onDeviceChange(e.target.value)} className="mx-1 w-64 text-center">
        {showLoading
          ?
          <option key={selectedDevice} value={selectedDevice} disabled>Loading...</option>
          :
          <>
            {selectedDevice === "" ? <option key="noDevice" value={""} disabled></option> : <></>}
            {spotify.connect.devices?.map((device) => (
              <option key={device.id} value={device.id?.toString()}>
                {device.name}
              </option>
            ))}
            {!hasOwnConnectPlayer ? (
              <option key={ownPlayerKey} value={ownPlayerKey}>
                Play music in browser
              </option>
            ) : (
              <></>
            )}
          </>}

      </select >
      {hasOwnConnectPlayer ? <SpotifyPlayer setIsLoading={setOwnConnectPlayerIsLoading} setLoadingError={handleErrorInPlayerLoading}></SpotifyPlayer> : <></>
      }
    </>
  );
};

export default SpotifyPlayerSelection;
