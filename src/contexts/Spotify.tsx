import { createContext, useContext, useEffect, useState } from 'react';
import { SpotifyApi, AuthorizationCodeWithPKCEStrategy, Scopes } from '@spotify/web-api-ts-sdk';

interface SpotifyContextProps {
  api?: SpotifyApi;
  login: () => Promise<void>;
  logout: () => void;
}

const SpotifyContext = createContext<SpotifyContextProps | undefined>(undefined);

type SpotifyProviderProps = {
  children?: React.ReactNode;
};

export const SpotifyProvider: React.FC<SpotifyProviderProps> = ({ children }) => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes = [...Scopes.playlist, ...Scopes.userPlayback, ...Scopes.userDetails]

  const [sdk, setSdk] = useState<SpotifyApi | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if(code) {
      // The code query-param indicates the redirect after login => complete login.
      login();
      return
    }

    if(!sdk) checkAccessToken();
  });

  const checkAccessToken = async () => {
    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
    const internalSdk = new SpotifyApi(auth);
    if (await internalSdk.getAccessToken()) {
      console.debug("SpotifyContext: AccessToken available")
      setSdk(internalSdk);
    } else {
      console.warn("SpotifyContext: No AccessToken available")
    }
  }

  const login = async () => {
    const auth = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
    const internalSdk = new SpotifyApi(auth);
    try {
      const { authenticated } = await internalSdk.authenticate();

      if (authenticated) {
        console.info("SpotifyContext: Successfully authenticated");
        setSdk(internalSdk);
      } else {
        console.error("SpotifyContext: Failed to authenticated");
      }
    } catch (e: Error | unknown) {

      const error = e as Error;
      if (error && error.message && error.message.includes("No verifier found in cache")) {
        console.error("If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).", error);
      } else {
        console.error(e);
      }
    }

  };

  const logout = () => {
    sdk?.logOut();
    setSdk(undefined);
  }

  return (<SpotifyContext.Provider value={{
    login,
    logout,
    api: sdk,
  }}>
    {children}
  </SpotifyContext.Provider>);
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};