import React, { useEffect, useState } from 'react';
import { Track } from '@spotify/web-api-ts-sdk';
import { SpotifyComponent } from '../types';

const SpotifyPlaylist: React.FC<SpotifyComponent> = ({spotify}) => {
    const [song, setSong] = useState<Track | undefined>();
    const [songId, setSongId] = useState<number>(102)

    const playlistId = "26zIHVncgI9HmHlgYWwnDi"

    

    useEffect(() => {
        if (!song && spotify) {
            (async () => {
                const result = await spotify.playlists.getPlaylistItems(playlistId, undefined, undefined, 1,  songId - 1)
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