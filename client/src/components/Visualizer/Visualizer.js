import React, { useState, useEffect, useCallback, useRef } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes
export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    // const [ beats, setBeats ] = useState([]);
    const shapes = ["circle", "square"];
    const rotations = ["", "deg60", "deg45", "deg30"];
    // const timeouts = [];
    const maxNumOfFigs = 10;
    const maxR = 300;
    const minR = 20;
    const padding = 50;
    // const removedIndex = useRef(0);

    // console.log('trackAnalysis', trackAnalysis);
    // console.log('trackFeatures', trackFeatures);
        
    // utility functions for making figures
    const getRandomDim = () => Math.floor(Math.random() * (maxR - minR) + minR);
    const getDim = (max, start) => Math.floor((max - start) * minR);
    // const getRandomX = (dim) => Math.floor(Math.random() * (window.innerWidth - dim - padding));
    const getXPos = (pitch, dim) => Math.floor((pitch / 12) * (window.innerWidth - dim - padding));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim - padding));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];   
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((segment) => {
        console.log("segment data", segment);
        // const dim = getRandomDim();
        const dim = getDim(segment.loudness_max, segment.loudness_start);
        // const x = getRandomX(dim);
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
        // setFigures(figures => {
        //     figures.splice(removedIndex.current, 1);
        //     return figures;
        // });  
        setFigures(figures => figures.splice(1));
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence >= 0.5));
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
                setTimeout(makeFigure.bind(null, segments[i]), segments[i].start * 1000);
            }
        }
    }, [playing, segments, makeFigure]);

    // remove circles so max 10 are on screen at one time
    useEffect(() => {
        if (figures.length > maxNumOfFigs) {
            // removedIndex.current = (removedIndex.current + 1) % (figures.length - 1);
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
