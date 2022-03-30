import React, { useState, useEffect, useCallback, useRef } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes

export default function Visualizer({ trackAnalysis, trackFeatures, playing, setTimings }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const index = useRef(0);
    const maxVol = useRef(0);
    const minVol = useRef(100);
    const weightedShapes = {"": 0.4, "circle": 0.2, "line": 0.1, "image": 0.3 };
    const weightedRotations = {"": 0.4, "deg60": 0.1, "deg45": 0.3, "deg30": 0.2 };
    const maxNumOfFigs = 12; // make this dependent on track features

    // utility functions for making figures;
    // r1 is domain, r2 is range
    function convertRange(value, r1, r2) { 
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }
    const volDomain = [minVol.current, maxVol.current];
    const volRange = [10, window.innerWidth / 1.6];
    console.log("minVol: " + minVol.current);
    console.log("maxVol: " + maxVol.current);
    
    const scale = (size) => (-0.022 * (size - 115.766) ** 2 + 296.933) * window.innerHeight / 100;
    // const getDim = (max, start) => Math.floor(convertRange(Math.abs(max - start), volDomain, volRange)) + 10;
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
        const shapeClass = getWeightedProp(weightedShapes);   // choose what shape to renderat all
        const rotationClass = getWeightedProp(weightedRotations);  // choose a rotation for figures if at all
        const classes = `${shapeClass()} ${rotationClass()}`;   // combine all class names to one string
        const scaledDim = (Math.random() * 2 * dim) + (0.25 * dim);    // to scale figures in one dimension and make non-perfect shapes
        const opacity = (Math.random() * (0.7)) + 0.2;
        const fig = { dim, x, y, color, classes, scaledDim, opacity };
        setFigures(figures => {
            figures[idx] = fig;
            return [...figures];
        });
    }, []);

    // preload some figures in beginning
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
                // get loudness values to create a scale for figure size
                const loudness = getLoudnessValue(segment);
                if (loudness > maxVol.current) {
                    maxVol.current = loudness;
                }
                if (loudness < minVol.current) {
                    minVol.current = loudness;
                } 

                const figTimeout = setTimeout(() => {
                    index.current = (index.current + 1) % maxNumOfFigs;
                    makeFigure(segment, index.current);
                    console.log(segment);
                }, segment.start * 1000);

                setTimings(timings => {
                    return [...timings, figTimeout];
                });

                return () => {
                    clearTimeout(figTimeout);
                }
            });
        } 
    }, [playing]);

    function getLoudnessValue(segment) {
        return segment.loudness_max - segment.loudness_start;
    }

    // make key random number to avoid moving around everywhere but it might be interesting
    return (
        <div className="visualizerSpace">
            {figures.map(({ dim, x, y, color, classes, scaledDim, opacity }, index) => (
                <Figure 
                    key={index}
                    dim={dim}
                    x={x}
                    y={y}
                    color={color}
                    scaledDim={scaledDim}
                    opacity={opacity}
                    className={classes}
                />
            ))}
        </div>
    )
}
