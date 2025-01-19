import { WebPlaybackSDK, usePlayerDevice } from "react-spotify-web-playback-sdk";
import { useSpotify } from "../../contexts/Spotify";
import React, { useEffect, useState } from "react";

const MyPlayer: React.FC = () => {
  const spotify = useSpotify();
  const playerDevice = usePlayerDevice();

  useEffect(() => {
    if (!playerDevice || playerDevice.status !== "ready") return;

    spotify.connect.setNewActiveDevice(playerDevice.device_id);
  }, [playerDevice]);

  return <></>;
};

const SpotifyPlayer: React.FC = () => {
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
        <MyPlayer />
      </div>
    </WebPlaybackSDK>
  );
};

const SpotifyPlayerSelection: React.FC = () => {
  const [hasOwnConnectPlayer, setHasOwnConnectPlayer] = useState<boolean>(false);

  const spotify = useSpotify();

  if (!spotify.api) return null;

  useEffect(() => {
    if (!spotify.connect.devices) {
      spotify?.connect.refreshDevices();
    }
  }, [spotify]);

  const ownPlayerKey = "ownPlayer";
  const onDeviceChange = (deviceId: string) => {
    if (deviceId === ownPlayerKey) {
      setHasOwnConnectPlayer(true);
      return;
    }
    spotify.connect.setNewActiveDevice(deviceId);
  };

  const selectedDevice = spotify.connect.activeDevice?.id ? spotify.connect.activeDevice.id : "";

  // TODO: Play on select input should indicate loading while chaning the device

  return (
    <>
      Play on:
      <select value={selectedDevice} onChange={(e) => onDeviceChange(e.target.value)} className="mx-1 w-64 text-center">
        {selectedDevice === "" ? <option key="noDevice" value={""} disabled></option> : <></>}
        {spotify.connect.devices?.map((device) => (
          <option key={device.id} value={device.id?.toString()}>
            {device.name}
          </option>
        ))}
        {!hasOwnConnectPlayer ? (
          <option key={ownPlayerKey} value={ownPlayerKey}>
            Create new device
          </option>
        ) : (
          <></>
        )}
      </select>
      {hasOwnConnectPlayer ? <SpotifyPlayer></SpotifyPlayer> : <></>}
    </>
  );
};

export default SpotifyPlayerSelection;
