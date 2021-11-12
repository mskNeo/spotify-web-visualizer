import React, { useState, useEffect, useCallback } from 'react'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes
export default function Visualizer({ trackAnalysis, trackFeatures, playing, timeElapsed }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const [ segmentTimes, setSegmentTimes ] = useState([]);
    const [ beats, setBeats ] = useState([]);
    const shapes = ["circle", "square"];
    const maxR = 300;
    const padding = 50;

    console.log('trackAnalysis', trackAnalysis);
    console.log('trackFeatures', trackFeatures);
        
    // utility functions for making circles/shapes
    const getRandomDim = () => Math.floor(Math.random() * maxR);
    const getRandomX = (dim) => Math.floor(Math.random() * (window.innerWidth - dim - padding));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim - padding));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    
    // make a figure based on random dimensions
    const makeFigure = useCallback(() => {
        const dim = getRandomDim();
        const x = getRandomX(dim);
        const y = getRandomY(dim);
        const color = getRandomColor();
        const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];   // choose what shape to render
        setFigures(figures => figures.concat({ dim, x, y, color, class: shapeClass })); // add figure to figure array
    }, []);

    // remove figure funcion to limit
    const removeFigure = useCallback(() => {
        setFigures(figures => figures.splice(1));
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence > 0.6));
            setBeats(trackAnalysis.beats.filter(beat => beat.confidence >= 0.1));
        }
    }, [trackAnalysis]);

    // check when music is playing
    useEffect(() => {
        console.log("playing", playing);
    }, [playing]);

    // make figures for the segments when music plays
    useEffect(() => {
        for (let i = 0; i < segments.length; i++) {
            let x = setTimeout(makeFigure, segments[i].start * 1000);
            if (!playing) {
                clearTimeout(x);
            }
        }
    }, [segments, playing, makeFigure]);

    // remove circles so max 5 are on screen at one time
    useEffect(() => {
        if (figures.length > 5) {
            removeFigure();
        }
    }, [figures, removeFigure]);

    return (
        <div className="visualizerSpace">
            {figures.map((c, i) => {
                return (
                    <div 
                        key={i} 
                        style={{ 
                            height: `${c.dim}px`, 
                            width: `${c.dim}px`, 
                            top: `${c.y}px`,
                            left: `${c.x}px`,
                            background: `rgb(${c.color[0]}, ${c.color[1]}, ${c.color[2]})`
                            }} 
                        className={`beat ${c.class}`} />
                )
            })}
        </div>
    )
}
