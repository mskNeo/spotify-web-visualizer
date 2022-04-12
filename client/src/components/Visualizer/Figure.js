// uses https://random.responsiveimages.io/
import React from 'react'

export default function Figure({ dim, x, y, color, classes, scaledDim, opacity }) {
    let classNames = classes.split(' ');
    const shape = classNames.shift();
    let transforms = '';
    for (let i = 0; i < classNames.length; i++) {
        transforms += ' ' + classNames[i];
    }

    console.log(transforms);

    switch(shape) {
        case 'line':
            return (
                <div 
                    className={shape}
                    style={{ 
                            height: `${10}px`,
                            width: `${dim * 4 *  Math.sin(y / x)}px`,
                            top: `${y}px`,
                            left: `${x}px`,
                            opacity: opacity,
                            background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                            transform: transforms
                            }} >
                    
                </div>
            )
        case 'image':
            return (
                <div 
                    className={shape}
                    style={{ 
                            height: `${dim}px`,
                            width: `${scaledDim}px`,
                            top: `${y}px`,
                            left: `${x}px`,
                            opacity: opacity,
                            transform: transforms
                            }} >
                    <img src={`https://picsum.photos/${dim}.webp`} alt="random pic from API" style={{ height: '100%', width: '100%'}} type="image/webp" />
                </div>
            )
        default:
            return(
                <div 
                    className={shape}
                    style={{ 
                            // activate as option
                            // height: `${Math.random() * (0.99 * dim) + 0.99 * dim}px`, 
                            // width: `${Math.random() * (0.99 * dim) + 0.99 * dim}px`, 
                            height: `${dim}px`, 
                            width: `${scaledDim}px`, 
                            top: `${y}px`,
                            left: `${x}px`,
                            opacity: opacity,
                            background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                            mixBlendMode: "difference",
                            transform: transforms
                            }} > 
                </div>
            )
    }
}
