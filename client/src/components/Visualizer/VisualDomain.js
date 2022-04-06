import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import Player from './Player'
import Visualizer from './Visualizer';

export default function VisualDomain({ accessToken, playingTrack, setPlayingTrack, trackAnalysis, trackFeatures, deselectTrack, setTimings }) {
    const [ playing, setPlaying ] = useState(false);
    const [ update, setUpdate ] = useState(false);

    const setTrackStatus = useCallback((cond) => {
        setPlaying(cond);
    }, []);

    useEffect(() => {
        console.log("playing track changed", playingTrack);
        const playBtn = document.querySelector(".rswp__toggle");
        if (playBtn) playBtn.click();
    }, [playingTrack])

        return (
            <div>
                {playingTrack &&
                    <div>
                        <ArrowLeft 
                            onClick={deselectTrack} 
                            style={{ 
                                cursor: "pointer",
                                width: "30px",
                                height: "30px",
                                zIndex: "1000"}} />
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
                            setTrackStatus={setTrackStatus}
                            setPlayingTrack={setPlayingTrack}
                            playingTrack={playingTrack} />
                    </div>
                }
            </div>
        )
}
