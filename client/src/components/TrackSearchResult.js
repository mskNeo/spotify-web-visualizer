import React, { useState } from 'react'

export default function TrackSearchResult({ track, chooseTrack }) {
    const [ background, setBackground ] = useState('#fff');

    function handlePlay() {
        chooseTrack(track)
    }

    return (
        <div 
            className="d-flex m-2 p-2 align-items-center"
            style={{ cursor: "pointer", background: background }}
            onMouseEnter={() => setBackground("#ccc")}
            onMouseLeave={() => setBackground("#fff")}
            onClick={handlePlay}
        >
            <img src={track.albumUrl} style={{ height: '64px', width: '64px' }} alt={`${track.title} album cover`} />
            <div className="px-3">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
        </div>
    )
}
