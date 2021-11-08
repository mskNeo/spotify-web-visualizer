import React, { useState, useEffect, useCallback } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes
export default function Visualizer({ trackAnalysis, trackFeatures, playing, timeElapsed }) {
    const [ circles, setCircles ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const [ segmentTimes, setSegmentTimes ] = useState([]);
    const [ beats, setBeats ] = useState([]);
    const maxR = 300;
    const padding = 50;
    
        
    const getRandomDim = () => Math.floor(Math.random() * maxR);
    const getRandomX = (dim) => Math.floor(Math.random() * (window.innerWidth - dim - padding));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim - padding));
    
    const makeCircle = useCallback(() => {
        const dim = getRandomDim();
        const x = getRandomX(dim);
        const y = getRandomY(dim);
        setCircles(circles => circles.concat({ dim, x, y }));
    }, []);

    const removeCircle = useCallback(() => {
        setCircles(circles => circles.splice(1));
    }, []);

    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence > 0.55));
            setBeats(trackAnalysis.beats.filter(beat => beat.confidence >= 0.1));
        }
    }, [trackAnalysis]);

    useEffect(() => {
        setSegmentTimes(segments.map(segment => parseFloat(segment.start.toFixed(4))));
    }, [segments]);

    // make circles for the segments
    useEffect(() => {
        if (segments) {
            if (playing) {
                // console.log("segment times", segmentTimes);
                for (let i = 0; i < segments.length; i++) {
                    setTimeout(makeCircle, segments[i].start * 1000);
                }
            }
        }
    }, [segments, playing, makeCircle]);

    // remove circles so max 5 are on screen at one time
    useEffect(() => {
        if (circles.length > 5) {
            removeCircle();
        }
    }, [circles, removeCircle]);

    return (
        <div className="visualizerSpace">
            {circles.map((c, i) => {
                return (
                    <div 
                        key={i} 
                        style={{ 
                            height: `${c.dim}px`, 
                            width: `${c.dim}px`, 
                            top: `${c.y}px`,
                            left: `${c.x}px`
                            }} 
                        className="beatCircle" />
                )
            })}
        </div>
    )
}
