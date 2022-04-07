import React, { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({ accessToken, trackUri, setTrackStatus }) {
    const [play, setPlay] = useState(false);

    useEffect(() => {
        if (trackUri) {
            setPlay(true);
        } else {
            setPlay(false);
        }
    }, [trackUri]);
    
    if (!accessToken) return null;

    return (
        <SpotifyPlayer 
            token={accessToken}
            callback={state => {
                setTrackStatus(state.isPlaying);
                if (!state.isPlaying) {
                    setPlay(true);
                }
            }}
            autoPlay={true}
            play={play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                height: 60,
                bgColor: 'transparent'
            }}
        />
    )
}
