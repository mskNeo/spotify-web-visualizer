import React, { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({ accessToken, trackUri, setTrackStatus, setTrackProgress }) {
    const [play, setPlay] = useState(false);

    useEffect(() => setPlay(true), [trackUri]);
    
    if (!accessToken) return null;

    return (
        <SpotifyPlayer 
            token={accessToken}
            showSaveIcon
            callback={state => {
                setTrackStatus(state.isPlaying);
                setTrackProgress(state.progressMs);
                if (!state.isPlaying) {
                    setPlay(false);
                }
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                height: 50,
            }}
        />
    )
}
