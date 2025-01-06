import { useLocalStorage } from 'react-use';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string>('access_token');
  const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string>('refresh_token');
  const [expiresIn, setExpiresIn, removeExpiresIn] = useLocalStorage<string>('expires_in');
  const [expires, setExpires, removeExpires] = useLocalStorage<string>('expires');

  return {
    accessToken, setAccessToken, removeAccessToken,
    refreshToken, setRefreshToken, removeRefreshToken,
    expiresIn, setExpiresIn, removeExpiresIn,
    expires, setExpires, removeExpires
  };
};

export default useSpotifyAuth;