import React, { useEffect, useState } from 'react';
import { Track } from '@spotify/web-api-ts-sdk';
import { useSpotify } from '../contexts/Spotify';

const SpotifyPlaylist: React.FC = () => {
    const [song, setSong] = useState<Track | undefined>();
    const [songId, setSongId] = useState<number>(102)

    const playlistId = "26zIHVncgI9HmHlgYWwnDi"

    const spotify = useSpotify();

    useEffect(() => {
        if (!song && spotify.api) {
            (async () => {
                console.log("Spotify is ", spotify.api)
                const result = await spotify.api?.playlists.getPlaylistItems(playlistId, undefined, undefined, 1,  songId - 1)
                setSong(() => result.items[0].track);
            })();
        }
      }, [playlistId, song, songId, spotify]);

    return (
        <div>
            <p>Artist: { song?.artists[0].name }</p>
            <p>Title: { song?.name  }</p>
            <p>Year: { song?.album.release_date  }</p>
        </div>
    );
};

export default SpotifyPlaylist;