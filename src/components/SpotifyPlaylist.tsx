// A react component that handles the spotify authentication via the Authorization Code with PKCE flow
import React, { useState } from 'react';
import { useSpotifyAuth } from "../contexts/SpotifyAuth";

interface SongInformation {
    artist: string,
    title: string,
    year: number,
}

const SpotifyPlaylist: React.FC = () => {
    const auth = useSpotifyAuth();
    const [tracks, setTracks] = useState([]);
    const [tracksLoading, setTracksLoading] = useState(false); // Todo: remove when fixed

    const playlistApiEndpoint = "https://api.spotify.com/v1/playlists"
    const playlistId = "26zIHVncgI9HmHlgYWwnDi"
    const songid = Math.floor(Math.random() * 99)

    const getSongInfo: (track: Array<any>) => SongInformation = (track) => {
        track = track.track
        if (track) {
            return {
                "artist": track.artists[0].name,
                "title": track.name,
                "year": track.album.release_date,
            } as SongInformation
        }
        else {
            return  {} as SongInformation
        }
    };
    if (!tracksLoading) {
        setTracksLoading(true);
        (async () => {
                const response = await fetch(playlistApiEndpoint + "/" + playlistId, {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + auth.accessToken },
                })
                const json_response = await response.json();
                setTracks(json_response.tracks.items);
        })()
    }

    const songInfo: SongInformation = tracks.length > 0 ? getSongInfo(tracks[songid]) : {} as SongInformation

    return (
        <div>
            <p>Artist: { songInfo.artist }</p>
            <p>Title: { songInfo.title  }</p>
            <p>Year: { songInfo.year  }</p>
        </div>
    );
};

export default SpotifyPlaylist;