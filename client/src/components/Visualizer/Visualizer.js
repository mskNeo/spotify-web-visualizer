import React, { useState, useEffect, useCallback, useRef } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes

export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const figuresRef = useRef([]);
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const count = useRef(0);
    const shapes = ["circle", "square", "line"];
    const rotations = ["", "deg60", "deg45", "deg30"];
    // const red = [255, 0, 0];
    // const green = [0, 255, 0];
    // const blue = [0, 0, 255];
    // const colors = [red, green, blue];
    const maxNumOfFigs = 10;
    const scale = (size) => (-0.022 * (size - 115.766) ** 2 + 296.933) * window.innerHeight / 100;    // scaling function for noises

    console.log(trackAnalysis);
    // console.log(trackFeatures);
        
    // utility functions for making figures;
    const getDim = (max, start) => Math.floor(scale(Math.abs(max - start)));
    const getXPos = (pitch, dim) => Math.floor((pitch / 12) * (window.innerWidth - dim) + ((Math.random() * (300 - 50)) + 50));
    const getYPos = (dim) => Math.floor(Math.random() * (window.innerHeight - dim));
    // const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];   
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];   
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((segment) => {
        const dim = getDim(segment.loudness_max, segment.loudness_start);
        const x = getXPos(segment.pitches.indexOf(1), dim);
        const y = getYPos(dim);
        const color = getRandomColor();
        const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];   // choose what shape to render
        const rotationClass = rotations[Math.floor(Math.random() * rotations.length)];  // choose a rotation for figures if at all
        const classes = `figure ${shapeClass} ${rotationClass}`;   // combine all class names to one string
        const fig = { dim, x, y, color, classes };
        setFigures(figures => figures.concat(fig));
        // if (figuresRef.current.length === maxNumOfFigs) {
        //     figuresRef.current[count.current] = fig;
        //     setFigures(figures => figuresRef.current);

        // } else {
        //     figuresRef.current = figuresRef.current.concat(fig);
        //     setFigures(figures => figuresRef.current);
        // }
        
    }, []); // add figures as dependency for all shapes to show up, else leave blank for 1 to show up each time

    // remove figure funcion to limit
    const removeFigure = useCallback(() => {
        // remove at index
        setFigures(figures => figures.splice(1));
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            // setSegments(trackAnalysis.segments.filter(segment => segment.confidence >= 0.25));
            setSegments(segments => trackAnalysis.segments);
        }
    }, [trackAnalysis]);


    // start visualizer when song is playing, stop when paused
    useEffect(() => {
        if (playing) {
            segments.map(segment => {
                const figTimeout = setTimeout(() => {
                    count.current = (count.current + 1) % maxNumOfFigs;
                    makeFigure(segment);
                }, segment.start * 1000);

                return () => {
                    setTimeout(figTimeout);
                }
            });
        } 
    }, [playing]);

    // only have specified number of figures on screen
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
                        key={Math.round(Math.random() * 1000000)}
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
