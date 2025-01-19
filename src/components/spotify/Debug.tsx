import React, { FormEvent, useState } from "react";
import { useSpotify } from "../../contexts/Spotify";
import { JSONTree } from "react-json-tree";
import { Playlist, Track, User } from "@spotify/web-api-ts-sdk";

interface DebugCacheProps {
  playlists?: Playlist[];
  tracks?: Track[];
  users?: User[];
}

enum ApiTypes {
  user = 0,
  playlist = 1,
  userPlaylists = 2,
  track = 3,
  currentlyPlaying = 4,
}

export const SpotifyDebug: React.FC = () => {
  const spotify = useSpotify();

  const [apiType, setApiType] = useState<number | undefined>();
  const [debugCache, setDebugCache] = useState<DebugCacheProps>({});
  const [result, setResult] = useState({});

  if (!spotify.api?.getAccessToken()) return null;

  const searchUser = async (query: string) => {
    const user = await spotify.api?.users.profile(query);
    console.debug(user);
    if (user) {
      setDebugCache({ ...debugCache, users: [user] });
      setResult(() => user);
    } else {
      setResult("user not found");
    }
  };

  const searchPlaylist = async (query: string) => {
    if (query === "") {
      setResult(() => debugCache.playlists);
      return;
    }
    const playlist = await spotify.api?.playlists.getPlaylist(query);
    console.debug(playlist);
    if (playlist) {
      setDebugCache({ ...debugCache, playlists: [playlist] });
    }
  };

  const getUserPlaylist = async () => {
    const user = debugCache.users ? debugCache.users[0] : undefined;
    if (!user) {
      setResult("pls select user first");
      return;
    }
    const playlists = await spotify.api?.playlists.getUsersPlaylists(user.id);
    console.debug(playlists);
    if (playlists) {
      setDebugCache({ ...debugCache, playlists: playlists.items });
      setResult(() => playlists.items);
    }
  };

  const search = async (event: FormEvent) => {
    event.preventDefault();

    const query = event.target.query.value;

    console.log("query: ", query);

    if (apiType === ApiTypes.user) {
      searchUser(query);
    }
    if (apiType === ApiTypes.playlist) {
      searchPlaylist(query);
    }
    if (apiType === ApiTypes.userPlaylists) {
      getUserPlaylist();
    }
    if (apiType == ApiTypes.currentlyPlaying) {
      const result = await spotify.api?.player.getCurrentlyPlayingTrack();
      setResult(result as object);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 w-lvw">
        <div>
          <strong>Cache</strong>
          <br />
          User: {debugCache.users?.length ? debugCache.users[0].display_name : null}
          <br />
          Playlist: {debugCache.playlists ? debugCache.playlists[0].name : null}
          <br />
          Track: {debugCache.tracks ? debugCache.tracks[0].id : null}
        </div>
      </div>

      <label>Api Type: </label>
      <select
        name="api_type"
        value={apiType ? apiType : ""}
        onChange={(e) => {
          setApiType(parseInt(e.target.value));
        }}
      >
        <option value="" disabled></option>
        {Object.keys(ApiTypes).map((type) => {
          if (Number.isNaN(parseInt(type))) {
            return <option value={ApiTypes[type]}>{type}</option>;
          }
          return null;
        })}
      </select>
      <form onSubmit={search}>
        <input name="query" className="text-black" />
        <select name="type" className="mx-2"></select>
        <button type="submit">Search</button>
      </form>
      <br />
      <div className="h-96 w-lvw overflow-auto overflow-x-auto">
        <JSONTree data={result} />
      </div>
    </div>
  );
};
