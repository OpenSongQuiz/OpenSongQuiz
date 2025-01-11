import React, { useCallback, useEffect, useState } from 'react';
import { Device, Track } from '@spotify/web-api-ts-sdk';
import { useSpotify } from '../contexts/Spotify';

enum ButtonStateEnum {
    Start = 0,
    RevealSong = 1,
    ErrorTryAgain = 2,
    PlaySong = 3,
}

interface Playback {
    devices?: Device[],
    selected: string
}

const SpotifyPlaylist: React.FC = () => {
    const [song, setSong] = useState<Track | undefined>();
    const [buttonState, setButtonState] = useState<number>(0);
    const [checkboxState, setCheckboxState] = useState<boolean>(true)
    const [playbackError, setplaybackError] = useState<string>("")
    const [playback, setPlayback] = useState<Playback | null>()

    const spotify = useSpotify()

    const playlistId = "26zIHVncgI9HmHlgYWwnDi"

    const setAvailableDevicesAsync = useCallback(async () => {
            const playback = {selected: ""} as Playback
            const devices = await spotify.api?.player.getAvailableDevices()
            playback.devices = devices?.devices
            playback.selected = playback.devices ? playback.devices[playback.devices.findIndex((device) => device.is_active === true)]?.id : ""
            setPlayback(playback)
    }, [spotify.api])

    const transfertPlaybackAsync = async (device_id: string) => {
        await spotify.api?.player.transferPlayback([device_id])
        setTimeout(async () => {
            await setAvailableDevicesAsync();
        }, 1000);
    }

    useEffect((() => {
        setAvailableDevicesAsync();
    }), [setAvailableDevicesAsync, spotify.api]);

    if (!spotify.api) return null;

    const playNextSong = (nextOsqId: number | undefined) => {
        (async () => {
            const playlist = await spotify.api?.playlists.getPlaylist(playlistId)
            if (!playlist?.tracks?.total) {
                console.error("playlist not found " + playlistId)
                return;
            }
            setButtonState(ButtonStateEnum.RevealSong);
            nextOsqId = nextOsqId ? nextOsqId : Math.floor(Math.random() * (playlist?.tracks.total + 1))
            const playlistItems = await spotify.api?.playlists.getPlaylistItems(playlistId, undefined, undefined, 1,  nextOsqId - 1)
            const nextSong = playlistItems?.items[0].track;
            setSong(() => nextSong);
            if (nextSong) {
                const availableDevices = (await spotify.api?.player.getAvailableDevices())?.devices
                const device = availableDevices?.filter(session => session.is_active === true)
                if (device && device.length > 0 && device[0].id) {
                    await spotify.api?.player.startResumePlayback(device[0].id, "spotify:playlist:" + playlistId, undefined, {uri: nextSong.uri})
                }
                else {
                    setplaybackError("Spotify player not yet ready");
                    setButtonState(ButtonStateEnum.ErrorTryAgain);
                    return;
                }
            }
            setplaybackError("")
        })();
    }

    const playButtonClick = () => {
        setAvailableDevicesAsync();
        if (buttonState !== ButtonStateEnum.RevealSong) {
            
            playNextSong(undefined)
        }
        else {
            if (spotify?.api) {
                if (playback?.selected) spotify.api.player.pausePlayback(playback?.selected);
                setButtonState(ButtonStateEnum.PlaySong);
            }
        }
    }

    const pauseClick = () => {
        (async() => {
            if (spotify?.api && playback?.selected) {
                const state = await spotify.api.player.getPlaybackState()
                if (state.is_playing) {
                    spotify.api.player.pausePlayback(playback.selected);
                }
                else {
                    spotify.api.player.startResumePlayback(playback.selected);
                }
            }
        })();
    }

    const checkboxClick = () => {
        setCheckboxState(() => !checkboxState)
    }

    const title = song?.name
    const artist = song?.artists[0]?.name
    const year = song?.album.release_date.slice(0,4)

    const onDeviceChange = (device_id: string) => {
        transfertPlaybackAsync(device_id)
    }

    return (
        <div className='grid place-content-center'>
            Play on:
            <select value={playback?.selected} onChange={(e) => onDeviceChange(e.target.value)} className='mx-1 w-64 text-center'>
                { playback?.devices?.map((device) => (<option key={device.id}  value={device.id?.toString()}>{device.name}</option>))}
            </select>
            <label><input className="mx-1" type="checkbox" checked={checkboxState} onChange={checkboxClick} />Stop playback on reveal</label><br />

            <div className='bg-[#2a2a2a] rounded-3xl size-80 my-2'>
            <div id="song-info" className={"grid "+ (buttonState < 3 ? 'hidden' : '') + " size-full text-center place-items-center"}>
                <p className='text-xl'>{ title }</p>
                <p className='text-3xl'>{ year }</p>
                <p className='text-xl'>{ artist }</p>
            </div>
            </div>
            <div>{playbackError}</div>
            <button onClick={playButtonClick}>{ButtonStateEnum[buttonState]}</button><button onClick={pauseClick}>Play/Pause</button>
        </div>
    );
};

export default SpotifyPlaylist;