import React, { useState, useEffect, useCallback } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes
export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const [ removedFig, setRemovedFig ] = useState(0);
    // const [ time, setTime ] = useState(0.0);
    // const [ beats, setBeats ] = useState([]);
    const shapes = ["circle", "square"];
    const rotations = ["", "deg60", "deg45", "deg30"];
    // const timeouts = [];
    const maxR = 300;
    const minR = 50;
    const padding = 50;

    // console.log('trackAnalysis', trackAnalysis);
    // console.log('trackFeatures', trackFeatures);
        
    // utility functions for making figures
    const getRandomDim = () => Math.floor(Math.random() * (maxR - minR) + minR);
    const getRandomX = (dim) => Math.floor(Math.random() * (window.innerWidth - dim - padding));
    // const getXPos = (pitch, dim) => Math.floor((pitch / 12) * (window.innerWidth - dim - padding));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim - padding));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];   
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((pitches) => {
        const dim = getRandomDim();
        const x = getRandomX(dim);
        const y = getRandomY(dim);
        const color = getRandomColor();
        const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];   // choose what shape to render
        const rotationClass = rotations[Math.floor(Math.random() * rotations.length)];  // choose a rotation for figures if at all
        const classes = `figure ${shapeClass} ${rotationClass}`;   // combine all class names to one string
        setFigures(figures => figures.concat({ dim, x, y, color, class: classes })); // add figure to figure array
    }, []);

    // remove figure funcion to limit
    const removeFigure = useCallback((index) => {
        // remove at index
        // setFigures(figures => {
        //     figures.splice(index, 1);
        //     return figures;
        // });  
        setFigures(figures => figures.splice(1));   // remove first figure from figure array
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence >= 0.4));
            // setBeats(trackAnalysis.beats.filter(beat => beat.confidence >= 0.1));
        }
    }, [trackAnalysis]);

    // load set timeouts for making figures
    // pitches in segments refer to pitch classes
        // values are how dominant/relevant each pitch is (higher number = higher relevance/confidence)
    // timbre refers to quality of musical note
        // first value is average loudness
        // second value is brightness
        // third is flatness of sound
    useEffect(() => {
        if (playing) {
            for (let i = 0; i < segments.length; i++) {
                setTimeout(makeFigure.bind(null, segments[i].pitches), segments[i].start * 1000);
                // timeouts.push(x);
            }
            // console.log("timeouts", timeouts);
        }
    }, [playing, segments, makeFigure]);

    // remove circles so max 10 are on screen at one time
    useEffect(() => {
        if (figures.length > 10) {
            removeFigure(removedFig);
            setRemovedFig(fig => fig + 1);
        }
    }, [figures, removeFigure]);

    // make key random number to avoid moving around everywhere but it might be interesting
    return (
        <div className="visualizerSpace">
            {figures.map((c, i) => {
                return (
                    <Figure
                        key={i % figures.length} 
                        dim={c.dim}
                        x={c.x}
                        y={c.y}
                        color={c.color}
                        className={c.class} />
                )
            })}
        </div>
    )
}
