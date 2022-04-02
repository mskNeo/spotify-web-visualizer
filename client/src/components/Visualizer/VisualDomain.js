import React, { useState, useCallback } from 'react'
import Player from './Player'
import { ArrowLeft } from 'react-bootstrap-icons';
import Visualizer from './Visualizer';

export default function VisualDomain({ accessToken, playingTrack, trackAnalysis, trackFeatures, deselectTrack, setTimings }) {
    const [ playing, setPlaying ] = useState(false);

    const setTrackStatus = useCallback((cond) => {
        setPlaying(cond);
    }, []);

    if (playingTrack) {
        return (
            <div>
                <ArrowLeft onClick={deselectTrack} style={{ cursor: "pointer", width: "30px", height: "30px" }} />
                <Visualizer 
                    accessToken={accessToken} 
                    trackUri={playingTrack?.uri} 
                    trackAnalysis={trackAnalysis} 
                    trackFeatures={trackFeatures} 
                    playing={playing}
                    setTimings={setTimings}  />
                <Player 
                    accessToken={accessToken} 
                    trackUri={playingTrack?.uri} 
                    setTrackStatus={setTrackStatus} />
            </div>
        )
    }
}
