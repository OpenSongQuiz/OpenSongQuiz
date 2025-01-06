// A react component that handles the spotify authentication via the Authorization Code with PKCE flow
import React, { useEffect } from 'react';
import { useLocalStorage } from 'react-use';


const SpotifyAuth: React.FC = () => {
    const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>('access_token', null);
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refresh_token', null);
    const [expiresIn, setExpiresIn, removeExpiresIn] = useLocalStorage<string | null>('expires_in', null);
    const [expires, setExpires, removeExpires] = useLocalStorage<string | null>('expires', null);

    const authorizationEndpoint = "https://accounts.spotify.com/authorize";
    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    const clientId = '7760f245f5344b5b8f5735c4daf148c0';
    const redirectUri = 'http://localhost:8080';
    const scope = 'user-read-private user-read-email user-read-currently-playing streaming';

    useEffect(() => {
        (async function() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const code_verifier = localStorage.getItem('code_verifier');
            if (code && code_verifier) {
                const { access_token, refresh_token, expires_in } = await getToken(code, code_verifier);

                // Save tokens
                setAccessToken(access_token);
                setRefreshToken(refresh_token);
                setExpiresIn(expires_in.toString());

                const now = new Date();
                const expiry = new Date(now.getTime() + (expires_in * 1000));
                setExpires(expiry.toString());

                // Remove code from URL so we can refresh correctly.
                const url = new URL(window.location.href);
                url.searchParams.delete("code");

                const updatedUrl = url.search ? url.href : url.href.replace('?', '');
                window.history.replaceState({}, document.title, updatedUrl);
            }
        })();
    }, []);

    const getToken = async (code: string, code_verifier: string) => {
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
            code_verifier: code_verifier,
           })
        });

        return await response.json();
    };

    const handleLogin = async () => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const randomValues = crypto.getRandomValues(new Uint8Array(64));
        const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

        const code_verifier = randomString;
        const data = new TextEncoder().encode(code_verifier);
        const hashed = await crypto.subtle.digest('SHA-256', data);

        const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');

        window.localStorage.setItem('code_verifier', code_verifier);

        const authUrl = new URL(authorizationEndpoint)
        const params = {
          response_type: 'code',
          client_id: clientId,
          scope: scope,
          code_challenge_method: 'S256',
          code_challenge: code_challenge_base64,
          redirect_uri: redirectUri,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
    };

    return (
        <div>
            {!accessToken ? (
                <button onClick={handleLogin}>Login with Spotify</button>
            ) : (
                <p>Logged in with access token: {accessToken}</p>
            )}
        </div>
    );
};

export default SpotifyAuth;