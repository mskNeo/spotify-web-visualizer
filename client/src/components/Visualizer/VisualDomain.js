import React, { useState, useEffect, useCallback } from 'react'
import Player from './Player'
import { ArrowLeft } from 'react-bootstrap-icons';
import Visualizer from './Visualizer';

export default function VisualDomain({ accessToken, playingTrack, trackAnalysis, trackFeatures, deselectTrack }) {
    const [ playing, setPlaying ] = useState(false);
    const [ timeElapsed, setTimeElapsed ] = useState(0.0);

    const setTrackStatus = useCallback((cond) => {
        setPlaying(cond);
    }, []);

    const setTimeStamp = useCallback((time) => {
        setTimeElapsed(time);
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
                    timeElapsed={timeElapsed} />
                <Player 
                    accessToken={accessToken} 
                    trackUri={playingTrack?.uri} 
                    setTrackStatus={setTrackStatus} 
                    setTimeStamp={setTimeStamp} />
            </div>
        )
    }
}
