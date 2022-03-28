import React, { useState, useEffect, useCallback, useRef } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes

export default function Visualizer({ trackAnalysis, trackFeatures, playing }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const index = useRef(0);
    const shapes = ["", "circle", "line", "image"]; // generate weights based on track features
    const weightedShapes = {"": 0.4, "circle": 0.3, "line": 0.1, "image": 0.2 };
    const rotations = ["", "deg60", "deg45", "deg30"];  // generate weights based on track features
    const weightedRotations = {"": 0.4, "deg60": 0.1, "deg45": 0.3, "deg30": 0.2 };
    const maxNumOfFigs = 12; // make this dependent on track features

    // utility functions for making figures;
    // const scale = (size) => (-0.022 * (size - 115.766) ** 2 + 296.933) * window.innerHeight / 100;
    const scale = (size) => (29.807 * (1.089) ** size);
    const getDim = (max, start) => Math.floor(scale(Math.abs(max - start))) + 10;
    const getXPos = (pitch, dim) => Math.floor((pitch / 12) * (window.innerWidth - dim) + ((Math.random() * (300 - 50)) + 50));
    const getYPos = (dim) => Math.floor(Math.random() * (window.innerHeight - dim));
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];  

    // probabilities must add up to 1 and have only one significant figure
    const getWeightedProp = (props) => {
        let table = [];
        for (let i in props) {
            // multiply by 10 to get whole numbers
            for (let j = 0; j < props[i] * 10; j++) {
                table.push(i);
            }
        }
        return () => table[Math.floor(Math.random() * table.length)];
    }
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((segment, idx) => {
        const dim = getDim(segment.loudness_max, segment.loudness_start);
        const x = getXPos(segment.pitches.indexOf(1), dim);
        const y = getYPos(dim);
        const color = getRandomColor();
        // const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];   // choose what shape to render
        const shapeClass = getWeightedProp(weightedShapes);   // choose what shape to render
        // const rotationClass = rotations[Math.floor(Math.random() * rotations.length)];  // choose a rotation for figures if at all
        const rotationClass = getWeightedProp(weightedRotations);  // choose a rotation for figures if at all
        const classes = `${shapeClass()} ${rotationClass()}`;   // combine all class names to one string
        const fig = { dim, x, y, color, classes };
        setFigures(figures => {
            figures[idx] = fig;
            return [...figures];
        });
    }, []); // add figures as dependency for all shapes to show up, else leave blank for 1 to show up each time

    // preload some figs in beginning
    useEffect(() => {
        for (let i = 0; i < maxNumOfFigs; i++) {
            setFigures(figures.concat({ 
                dim: 0,
                x: 0,
                y: 0,
                color: [0, 0, 0],
                classes: '',
            }));
        }
    }, []);

    // load segments and beats when trackAnalysis received
    useEffect(() => {
        if (trackAnalysis) {
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence >= 0.2));
        }
    }, [trackAnalysis]);


    // start visualizer when song is playing, stop when paused
    useEffect(() => {
        if (playing) {
            segments.map(segment => {
                const figTimeout = setTimeout(() => {
                    index.current = (index.current + 1) % maxNumOfFigs;
                    makeFigure(segment, index.current);
                    console.log(segment);
                }, segment.start * 1000);

                return () => {
                    setTimeout(figTimeout);
                }
            });
        } 
    }, [playing]);

    // make key random number to avoid moving around everywhere but it might be interesting
    return (
        <div className="visualizerSpace">
            {figures.map(({ dim, x, y, color, classes }, index) => (
                <Figure 
                    key={index}
                    dim={dim}
                    x={x}
                    y={y}
                    color={color}
                    className={classes}
                />
            ))}
        </div>
    )
}
