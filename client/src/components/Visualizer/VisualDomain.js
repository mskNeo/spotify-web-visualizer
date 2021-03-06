import React, { useState, useCallback } from 'react';
import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import Player from './Player'
import Visualizer from './Visualizer';

export default function VisualDomain({ accessToken, playingTrack, trackAnalysis, trackFeatures, deselectTrack, setTimings, clearTimings }) {
    const [ playing, setPlaying ] = useState(false);

    const setTrackStatus = useCallback((cond) => {
        setPlaying(cond);
    }, []);

        return (
            <div>
                {playingTrack &&
                    <div>
                        <ArrowLeftCircleFill 
                            onClick={deselectTrack} 
                            style={{ 
                                cursor: "pointer",
                                width: "75px",
                                height: "75px",
                                zIndex: "1000",
                                color: "white",
                                position: "absolute",
                                mixBlendMode: "exclusion" }}
                            onMouseEnter={(e) => e.target.style.mixBlendMode = 'normal'}
                            onMouseLeave={(e) => e.target.style.mixBlendMode = 'exclusion'} />
                        <Visualizer 
                            accessToken={accessToken} 
                            trackUri={playingTrack?.uri} 
                            trackAnalysis={trackAnalysis} 
                            trackFeatures={trackFeatures} 
                            playing={playing}
                            setTimings={setTimings}
                            clearTimings={clearTimings}  />
                        <Player 
                            accessToken={accessToken} 
                            trackUri={playingTrack?.uri} 
                            setTrackStatus={setTrackStatus} />
                    </div>
                }
            </div>
        )
}
