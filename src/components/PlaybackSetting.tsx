import React from "react";

interface PlaybackSettingProps {
  label: string;
  getPlaybackSetting: () => boolean | undefined;
  setPlaybackSetting: (ar0: boolean | undefined) => void;
}

const PlaybackSetting: React.FC<PlaybackSettingProps> = ({ label, getPlaybackSetting, setPlaybackSetting }) => {
  const playbackSetting = getPlaybackSetting();

  if (typeof playbackSetting !== "boolean") {
    return <>Wrong playbackSettingKey</>;
  }

  const togglePlaybackSetting = () => {
    setPlaybackSetting(!playbackSetting);
  };

  return (
    <>
      <label>
        <input
          className="mx-1"
          type="checkbox"
          disabled={playbackSetting === undefined}
          checked={playbackSetting}
          onChange={togglePlaybackSetting}
        />
        {label} {playbackSetting === undefined && "(initialising ...)"}
      </label>
    </>
  );
};

export default PlaybackSetting;
