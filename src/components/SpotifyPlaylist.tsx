import React, { useEffect, useState } from 'react';
import { Track } from '@spotify/web-api-ts-sdk';
import { useSpotify } from '../contexts/Spotify';

interface SpotifyPlaylistComponent {
    osqId: number
}

const SpotifyPlaylist: React.FC<SpotifyPlaylistComponent> = ({osqId}) => {
    const [song, setSong] = useState<Track | undefined>();
    
    const spotifyApi = useSpotify().api
    const playlistId = "26zIHVncgI9HmHlgYWwnDi"    

    useEffect(() => {
        if (!song && spotifyApi) {
            (async () => {
                const result = await spotifyApi.playlists.getPlaylistItems(playlistId, undefined, undefined, 1,  osqId - 1)
                setSong(() => result.items[0].track);        
            })();
        }
      }, [playlistId, song, osqId, spotifyApi]);

    return (
        <div>
            <p>Artist: { song?.artists[0].name }</p>
            <p>Title: { song?.name  }</p>
            <p>Year: { song?.album.release_date  }</p>
            <p>SongId: {song?.id } </p>
        </div>
    );
};

export default SpotifyPlaylist;