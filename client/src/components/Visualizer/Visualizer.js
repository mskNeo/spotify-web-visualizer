import React, { useState, useEffect, useCallback, useRef } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes

export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const timestamp = Date.now();
    const [ time, setTime ] = useState(0.0);
    const [ segmentTimes, setSegmentTimes ] = useState([]);
    const countRef = useRef(null);
    // const removedIndex = useRef(0);
    // const [ beats, setBeats ] = useState([]);
    const shapes = ["circle", "square", "line"];
    const rotations = ["", "deg60", "deg45", "deg30"];
    const maxNumOfFigs = 10;
    const scale = (size) => (-0.022 * (size - 115.766) ** 2 + 296.933) * window.innerHeight / 100;    // scaling function for noises

    // console.log(trackAnalysis);
    // console.log(trackFeatures);
        
    // utility functions for making figures;
    const getDim = (max, start) => Math.floor(scale(Math.abs(max - start)));
    const getXPos = (pitch, dim) => Math.floor((pitch / 12) * (window.innerWidth - dim));
    const getRandomY = (dim) => Math.floor(Math.random() * (window.innerHeight - dim));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];   
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((segment) => {
        // console.log("segment data", segment);
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
        // setFigures(figures => {
        //     figures.splice(removedIndex.current, 1);
        //     return figures;
        // });  
        setFigures(figures => figures.splice(1));
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments);
            // setBeats(trackAnalysis.beats.filter(beat => beat.confidence >= 0.1));
        }
    }, [trackAnalysis]);

    useEffect(() => {
        setSegmentTimes(segments.map(segment => Math.round((segment.start) * 100) / 100));
    }, [segments]);

    // load set timeouts for making figures
    // pitches in segments refer to pitch classes
        // values are how dominant/relevant each pitch is (higher number = higher relevance/confidence)
    // timbre refers to quality of musical note
        // first value is average loudness
        // second value is brightness
        // third is flatness of sound
    // check when music is playing
    useEffect(() => {
        // console.log("playing", playing);
        if (playing) {
            countRef.current = setInterval(() => {
                setTime((time) => parseFloat(Date.now() - timestamp) / 10.00);
                // setTimestamp(Date.now());
            }, 10);

            if (time >= segmentTimes[0]) {
                makeFigure(segments[0]);
                setSegmentTimes(times => times.splice(1));
                setSegments(segments => segments.splice(1));
            }
        } else {
            clearInterval(countRef.current);
            console.log("time", time);
            // console.log("segment times", segmentTimes);
        }
        return () => {
            clearInterval(countRef.current);
        }
    }, [playing, time]);

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
