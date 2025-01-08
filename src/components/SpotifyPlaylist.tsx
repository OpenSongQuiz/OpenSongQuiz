import React, { useState } from 'react';
import { Track } from '@spotify/web-api-ts-sdk';
import { useSpotify } from '../contexts/Spotify';
import { usePlayerDevice, useSpotifyPlayer } from 'react-spotify-web-playback-sdk';

const SpotifyPlaylist: React.FC = () => {
    const [song, setSong] = useState<Track | undefined>();
    const [buttonState, setButtonState] = useState<number>(0);
    const [checkboxState, setCheckboxState] = useState<boolean>(true)

    const spotify = useSpotify()
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();

    const playlistId = "26zIHVncgI9HmHlgYWwnDi"    

    if (!spotify.api) return null;

    const playNextSong = (nextOsqId: number | undefined) => {
        (async () => {
            const playlist = await spotify.api?.playlists.getPlaylist(playlistId)
            if (!playlist?.tracks?.total) {
                console.error("playlist not found " + playlistId)
                return;
            }
            nextOsqId = nextOsqId ? nextOsqId : Math.floor(Math.random() * (playlist?.tracks.total + 1))
            const playlistItems = await spotify.api?.playlists.getPlaylistItems(playlistId, undefined, undefined, 1,  nextOsqId - 1)
            const nextSong = playlistItems?.items[0].track;
            setSong(() => nextSong);
            if (nextSong) {
                const availableDevices = (await spotify.api?.player.getAvailableDevices())?.devices
                if (availableDevices && device && availableDevices.filter(session => session.id === device.device_id).length > 0) {
                    await spotify.api?.player.transferPlayback([device.device_id])
                    await spotify.api?.player.startResumePlayback(device.device_id, "spotify:playlist:" + playlistId, undefined, {uri: nextSong.uri})
                }
                else {
                    console.warn("Spotify player not yet ready")
                }
                
            }
        })();
    }

    const buttonClick = () => {
        if (buttonState !== 1) {
            playNextSong(undefined);
            setButtonState(() => 1);
        }
        else {
            if (player) {
                if (checkboxState) player.pause();
                setButtonState(() => 2);
            }
        }
    }

    const checkboxClick = () => {
        setCheckboxState(() => !checkboxState)
    }

    const title = song?.name
    const artist = song?.artists[0]?.name
    const year = song?.album.release_date.slice(0,4)

    return (
        <div>
            <label><input type="checkbox" checked={checkboxState} onChange={checkboxClick} />Stop playback on reveal</label><br />
            <div id='song-info-container'>
            <div id="song-info" className={buttonState < 2 ? "hidden" : ""}>
                <h3>{ title }</h3>
                <h2>{ year }</h2>
                <h3>{ artist }</h3>
                
            </div>
            </div>
            <button onClick={buttonClick}>{buttonState === 0 || buttonState === 2 ? "Play next song" : "Reveal song" }</button>
        </div>
    );
};

export default SpotifyPlaylist;