import React, { useState, useEffect, useCallback } from 'react'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes
export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const [ time, setTime ] = useState(0.0);
    const [ beats, setBeats ] = useState([]);
    const shapes = ["circle", "square"];
    const rotations = ["", "deg60", "deg45", "deg30"];
    const timeouts = [];
    const maxR = 300;
    const padding = 50;

    // console.log('trackAnalysis', trackAnalysis);
    // console.log('trackFeatures', trackFeatures);
        
    // utility functions for making figures
    const getRandomDim = () => Math.floor(Math.random() * maxR);
    const getRandomX = (dim) => Math.floor(Math.random() * (window.innerWidth - dim - padding));
    const getXPos = (pitch, dim) => Math.floor(pitch * (window.innerWidth - dim - padding));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim - padding));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];   
    
    // make a figure based on random dimensions
    const makeFigure = useCallback(() => {
        const dim = getRandomDim();
        const x = getRandomX(dim);
        const y = getRandomY(dim);
        const color = getRandomColor();
        const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];   // choose what shape to render
        const rotationClass = rotations[Math.floor(Math.random() * rotations.length)];  // choose a rotation for figures if at all
        const classes = `${shapeClass} ${rotationClass}`;   // combine all class names to one string
        setFigures(figures => figures.concat({ dim, x, y, color, class: classes })); // add figure to figure array
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

    // load set timeouts for making figures
    useEffect(() => {
        if (playing) {
            for (let i = 0; i < segments.length; i++) {
                let x = setTimeout(makeFigure, segments[i].start * 1000);
                timeouts.push(x);
            }
            console.log("timeouts", timeouts);
        }
    }, [playing, segments]);

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
                        className={`figure ${c.class}`} />
                )
            })}
        </div>
    )
}
