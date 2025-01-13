import React from "react";

interface SongInfoProps {
  hidden: boolean;
  title: string | undefined;
  year: string | undefined;
  artist: string | undefined;
}

const SongInfo: React.FC<SongInfoProps> = ({ hidden, title, year, artist }) => {
  return (
    <div className="bg-[#2a2a2a] rounded-3xl size-80 my-2">
      <div id="song-info" className={"grid " + (hidden ? "hidden" : "") + " size-full text-center place-items-center"}>
        <p className="text-xl">{title}</p>
        <p className="text-3xl">{year}</p>
        <p className="text-xl">{artist}</p>
      </div>
    </div>
  );
};

export default SongInfo;
