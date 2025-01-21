import { expect, test } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";
import PlaybackSetting from "../components/PlaybackSetting";

test("PlaybackSetting changes playbackState", () => {
  let playbackState = false;
  const { queryByLabelText, getByLabelText } = render(
    <PlaybackSetting
      label="TestSetting"
      isLoading={false}
      playbackSettingState={playbackState}
      setPlaybackSetting={(state) => {
        playbackState = state;
      }}
    />,
  );

  expect(queryByLabelText(/TestSetting/i)).toBeTruthy();

  fireEvent.click(getByLabelText(/TestSetting/i));

  expect(playbackState).toBeTruthy();
});
