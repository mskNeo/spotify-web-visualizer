import React, { useState, useEffect, useCallback } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes

/*
 * 
 * Segment Example:
 * {
 *     confidence: 1
        duration: 0.40086
        loudness_end: 0
        loudness_max: -12.147
        loudness_max_time: 0.04935
        loudness_start: -60

        - pitches in segments refer to pitch classes
        - values are how dominant/relevant each pitch is (higher number = higher relevance/confidence)
        pitches: Array(12)
        0: 0.215
        1: 0.492
        2: 0.135
        3: 0.148
        4: 0.212
        5: 0.339
        6: 0.845
        7: 0.973
        8: 1
        9: 0.764
        10: 0.411
        11: 0.218
        length: 12
        start: 0

        - timbre refers to quality of musical note
        -- first value is average loudness
        -- second value is brightness
        -- third is flatness of sound
        timbre: Array(12)
        0: 32.038
        1: 12.596
        2: 32.547
        3: -218.246
        4: 63.535
        5: 263.998
        6: 77.766
        7: -41.082
        8: -32.466
        9: 95.46
        10: 8.31
        11: -1.434 
 * }
 */
export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const shapes = ["circle", "square", "line"];
    const rotations = ["", "deg60", "deg45", "deg30"];
    const maxNumOfFigs = 10;
    const minR = 20;
    const padding = 50;
        
    // utility functions for making figures;
    const getDim = (max, start) => Math.floor((max - start) * minR);
    const getXPos = (pitch, dim) => Math.floor((pitch / 12) * (window.innerWidth - dim - padding) + (Math.random() * (4 * padding) - 2 * padding));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim - padding));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];   
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((segment) => {
        const dim = getDim(segment.loudness_max, segment.loudness_start);
        const x = getXPos(segment.pitches.indexOf(1), dim);
        const y = getRandomY(dim);
        const color = getRandomColor();
        const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];   // choose what shape to render
        const rotationClass = rotations[Math.floor(Math.random() * rotations.length)];  // choose a rotation for figures if at all
        const classes = `figure ${shapeClass} ${rotationClass}`;   // combine all class names to one string
        const fig = { dim, x, y, color, classes };
        setFigures(figures => figures.concat(fig)); // add figure to figure array
    }, []); // add figures as dependency for all shapes to show up, else leave blank for 1 to show up each time

    // remove figure funcion to limit
    const removeFigure = useCallback(() => {
        // remove at index
        setFigures(figures => figures.splice(1));
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence >= 0.25));
        }
    }, [trackAnalysis]);


    // start visualizer when song is playing, stop when paused
    useEffect(() => {
        if (playing) {
            segments.map(segment => {
                return setTimeout(makeFigure.bind(null, segment), segment.start * 1000);
            });
        } 
    }, [playing]);

    // remove circles so max 10 are on screen at one time
    useEffect(() => {
        if (figures.length > maxNumOfFigs) {
            removeFigure();
        }
    }, [figures, removeFigure]);

    // make key random number to avoid moving around everywhere but it might be interesting
    return (
        <div className="visualizerSpace">
            {figures.map((c, i) => {
                return (
                    <Figure
                        key={Math.random() * 10000}
                        dim={c.dim}
                        x={c.x}
                        y={c.y}
                        color={c.color}
                        className={c.classes} />
                )
            })}
        </div>
    )
}
