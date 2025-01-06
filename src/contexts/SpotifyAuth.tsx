import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

interface SpotifyAuthContextProps {
  isAuthenticated: boolean;
  accessToken: string | undefined;
  logout: () => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextProps | undefined>(undefined);

type ProviderProps = {
  children?: React.ReactNode;
};

export const SpotifyAuthProvider: React.FC<ProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('access_token');
  const [codeVerifier, setCodeVerifier, removeCodeVerifier] = useLocalStorage<string>('code_verifier');
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string>('refresh_token');
  const [expiresIn, setExpiresIn, removeExpiresIn] = useLocalStorage<string>('expires_in');
  const [expires, setExpires, removeExpires] = useLocalStorage<string>('expires');

  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const clientId = '7760f245f5344b5b8f5735c4daf148c0';
  const redirectUri = 'http://localhost:8080';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && codeVerifier) {
      getToken(code, codeVerifier);

      // Remove code from URL so we can refresh correctly.
      const url = new URL(window.location.href);
      url.searchParams.delete("code");

      const updatedUrl = url.search ? url.href : url.href.replace('?', '');
      window.history.replaceState({}, document.title, updatedUrl);
    };
  });

  const getToken = async (code: string, codeVerifier: string) => {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      })
    });

    const { access_token, refresh_token, expires_in } = await response.json();

    // Save tokens
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setExpiresIn(expires_in.toString());

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    setExpires(expiry.toString());
  };

  const logout = () => {
    removeCodeVerifier();
    removeAccessToken();
    removeRefreshToken();
    removeExpiresIn();
    removeExpires();
  };

  return (<SpotifyAuthContext.Provider value={{
    accessToken,
    isAuthenticated: !!accessToken,
    logout
  }}>
    {children}
  </SpotifyAuthContext.Provider>);
};

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
  }
  return context;
};