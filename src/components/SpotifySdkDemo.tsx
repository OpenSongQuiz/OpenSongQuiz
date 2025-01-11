import React, { useEffect, useState } from "react";
import { useSpotify } from "../contexts/Spotify";
import { Device, Devices, PlaybackState, Track, UserProfile } from "@spotify/web-api-ts-sdk";

// TODO: Add button wich loads random song from playlist and starts playing

const SpotifySdkDemo: React.FC = () => {
  const spotify = useSpotify();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [devices, setDevices] = useState<Devices | null>(null);
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [track, setTrack] = useState<PlaybackState | null>(null);
  const [counter, setCounter] = useState<number>(0);

  const fetchProfile = async () => setProfile(await spotify.api!.currentUser.profile());
  const fetchDevices = async () => {
    const devices = await spotify.api!.player.getAvailableDevices();
    devices.devices.forEach((d) => {
      if (d.is_active) setActiveDevice(d);
    });
    setDevices(devices);
  };
  const fetchTrack = async () => setTrack(await spotify.api!.player.getCurrentlyPlayingTrack());
  const pause = () => {
    const id = activeDevice?.id;
    if (!id) return;

    // TODO: Fix error when pausing
    try {
      spotify.api?.player.pausePlayback(id);
    } catch (error) {
      console.log(error);
    }

    // TODO: Handle without setTimeout
    setTimeout(fetchTrack, 300);
  };
  const play = () => {
    const id = activeDevice?.id;
    if (!id) return;

    // TODO: Fix error when resuming
    try {
      spotify.api?.player.startResumePlayback(id);
    } catch (error) {
      console.log(error);
    }

    // TODO: Handle without setTimeout
    setTimeout(fetchTrack, 300);
  };
  const artist = () => {
    const t: Track | undefined = track?.item as Track;
    if (!t) return "No Artist";
    return t.artists.flatMap((el) => el.name).join(", ");
  };

  useEffect(() => {
    if (!spotify.api) return;
    fetchProfile();
    fetchDevices();
    fetchTrack();
  }, [spotify]);

  const refreshClick = () => {
    setCounter(() => counter + 1);
    if (!spotify.api) return;
    fetchProfile();
    fetchDevices();
    fetchTrack();
  };

  if (!spotify.api) return null;

  return (
    <div>
      <h2>SpotifySdkDemo</h2>
      <p>Profile: {profile?.display_name}</p>
      <p>Devices: {devices?.devices.flatMap((el) => (el.is_active ? <b>{el.name},</b> : el.name + ", "))}</p>
      <p>
        Track: {artist()} - {track?.item.name} ({track?.is_playing ? "playing" : "stopped"})
      </p>
      {track?.is_playing ? <button onClick={pause}>Pause</button> : <button onClick={play}>Resume</button>}
      <button onClick={refreshClick}>Refresh </button>
    </div>
  );
};

export default SpotifySdkDemo;
