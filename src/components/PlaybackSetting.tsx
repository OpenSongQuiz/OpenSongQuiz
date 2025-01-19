import React from "react";

interface PlaybackSettingProps {
  label: string;
  isLoading?: boolean;
  playbackSettingState: boolean;
  setPlaybackSetting: (ar0: boolean) => void;
}

const PlaybackSetting: React.FC<PlaybackSettingProps> = ({ label, isLoading, playbackSettingState, setPlaybackSetting }) => {

  const togglePlaybackSetting = () => {
    setPlaybackSetting(!playbackSettingState);
  };

  return (
    <>
      <label>
        <input
          className="mx-1"
          type="checkbox"
          disabled={isLoading}
          checked={playbackSettingState}
          onChange={togglePlaybackSetting}
        />
        {label} {isLoading && "(loading ...)"}
      </label>
    </>
  );
};

export default PlaybackSetting;
