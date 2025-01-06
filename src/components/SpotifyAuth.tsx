// A react component that handles the spotify authentication via the Authorization Code with PKCE flow
import React, { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { useSpotifyAuth } from '../contexts/SpotifyAuth';

// TODO: Implement refresh

const SpotifyAuth: React.FC = () => {
  const [codeVerifier, setCodeVerifier, removeCodeVerifier] = useLocalStorage<string>('code_verifier');
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string>('refresh_token');
  const [expiresIn, setExpiresIn, removeExpiresIn] = useLocalStorage<string>('expires_in');
  const [expires, setExpires, removeExpires] = useLocalStorage<string>('expires');

  const auth = useSpotifyAuth();

  const authorizationEndpoint = "https://accounts.spotify.com/authorize";
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const clientId = '7760f245f5344b5b8f5735c4daf148c0';
  const redirectUri = 'http://localhost:8080';
  const scope = 'user-read-private user-read-email user-read-currently-playing streaming';

  const handleLogin = async () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

    const codeVerifier = randomString;
    const data = new TextEncoder().encode(codeVerifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);

    const codeChallengeBase64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    setCodeVerifier(codeVerifier);

    const authUrl = new URL(authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallengeBase64,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
  };

  return (
    <div>
      {!auth.isAuthenticated ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <>
          <p>Logged in with access token: {auth.accessToken}</p>
          <button onClick={auth.logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default SpotifyAuth;