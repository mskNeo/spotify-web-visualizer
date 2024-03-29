import React, { useState, useEffect, useCallback, useRef } from 'react'
import Figure from './Figure'
import '../../styles/Visualizer.css'

// features to select color and shapes
// analysis to do placements, sizes

export default function Visualizer({ trackAnalysis, trackFeatures, playing, setTimings, clearTimings }) {
    const [ figures, setFigures ] = useState([]);
    const [ segments, setSegments ] = useState([]);
    const index = useRef(0);
    const backgroundNote = useRef();
    const weightedShapes = {"": 0.4, "circle": 0.3, "line": 0.1, "image": 0.2 };
    const weightedRotations = {"": 0.2, "deg60": 0.3, "deg45": 0.2, "deg30": 0.3 };
    const maxNumOfFigs = 12; // make this dependent on track features
    
    // const getDim = (max, start) => Math.floor(convertRange(Math.abs(max - start), volDomain, volRange)) + 10;
    const getXPos = (dim) => Math.random() * (window.innerWidth - dim);
    const getYPos = (pitch, dim) => ((window.innerHeight - dim) / 12) * pitch + (Math.random() * 100 - 50);     // divide vertical dimension into 12 sections
    const getRandomColor = () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];  
    const getBackgroundColor = (pitch=0) => `hsl(${360 / 12 * pitch} ${trackFeatures.energy * 100}% 50%)`;
    // const scale = (size) => (-0.022 * (size - 115.766) ** 2 + 296.933) * window.innerHeight / 100;
    const scale = (size) => 4299.42 * Math.cbrt(size - 243.171) + 26807.2;
    const getDim = (max, start) => Math.floor(scale(Math.abs(max - start))) + 10;

    // get property based on weighted probability
    const getWeightedProp = (props) => {
        let table = [];
        for (let i in props) {
            // multiply by 10 to get whole numbers
            for (let j = 0; j < props[i] * 10; j++) {
                table.push(i);
            };
        }
        return () => table[Math.floor(Math.random() * table.length)];
    }
    
    // make a figure based on random dimensions
    const makeFigure = useCallback((segment, idx) => {
        const dim = getDim(segment.loudness_max, segment.loudness_start);
        const x = getXPos(dim);
        const y = getYPos(segment.pitches.indexOf(1), dim);
        const color = getRandomColor();
        const shapeClass = getWeightedProp(weightedShapes);   // choose what shape to renderat all
        const rotationClass = getWeightedProp(weightedRotations);  // choose a rotation for figures if at all
        const classes = `${shapeClass()} ${rotationClass()}`;   // combine all class names to one string
        const scaledDim = (Math.random() * 0.3 * dim) + (0.7 * dim);    // to scale figures in one dimension and make non-perfect shapes
        // const scaledDim = dim * segment.loudness_max_time;    // to scale figures in one dimension and make non-perfect shapes
        const opacity = segment.confidence - 0.1;
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
            setSegments(trackAnalysis.segments.filter(segment => segment.confidence > 0.25));
        } 
    }, [trackAnalysis]);


    // start visualizer when song is playing, stop when paused
    useEffect(() => {
        if (playing) {
            segments.map(segment => {
                const figTimeout = setTimeout(() => {
                    index.current = (index.current + 1) % maxNumOfFigs;
                    makeFigure(segment, index.current);
                    if (index.current % trackFeatures.time_signature === 0) backgroundNote.current = segment.pitches.indexOf(1);
                    if (backgroundNote.current) {
                        document.body.style = `background: ${getBackgroundColor(backgroundNote.current)}`;
                    }
                }, segment.start * 1000);

                setTimings(timings => {
                    return [...timings, figTimeout];
                });

                return () => {
                    setTimeout(figTimeout);
                }
            });
        } 
        // pause
        else {
            clearTimings();
        }
    }, [playing]);

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
