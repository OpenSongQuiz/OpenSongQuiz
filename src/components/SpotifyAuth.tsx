// A react component that handles the spotify authentication via the Authorization Code with PKCE flow
import React from 'react';
import { SpotifyComponent } from '../types';

// TODO: Implement refresh

const SpotifyAuth: React.FC<SpotifyComponent> = ({spotify}) => {

  const spotifyLogoutClick = () => {
    spotify?.logOut()
    spotify?.authenticate()
  }

  return (
    <div>
      {!spotify ? (
        <div/>
      ) : (
        <>
          <button onClick={spotifyLogoutClick}>Logout</button>
        </>
      )}
    </div>
  );
};

export default SpotifyAuth;