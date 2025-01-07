// A react component that handles the spotify authentication via the Authorization Code with PKCE flow
import React from 'react';
import { useSpotify } from '../contexts/Spotify';

// TODO: Implement refresh

const SpotifyAuth: React.FC = () => {

  const spotify = useSpotify();

  return (
    <div>
      {!spotify.api ? (
        <>
          <button onClick={spotify.login}>Login</button>
        </>
      ) : (
        <>
          <button onClick={spotify.logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default SpotifyAuth;