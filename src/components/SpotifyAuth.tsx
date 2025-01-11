// A react component that handles the spotify authentication via the Authorization Code with PKCE flow
import React from "react";
import { useSpotify } from "../contexts/Spotify";
import { SpotifyLogo } from "./Icons";

// TODO: Implement refresh

const SpotifyAuth: React.FC = () => {
  const spotify = useSpotify();

  return (
    <div>
      {!spotify.api ? (
        <button className="bg-spotifygreen text-black border-black" onClick={spotify.login}>
          <SpotifyLogo />
          Login with Spotify
        </button>
      ) : null}
    </div>
  );
};

export default SpotifyAuth;
