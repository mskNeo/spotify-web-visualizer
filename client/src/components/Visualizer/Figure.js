// uses https://random.responsiveimages.io/
import React from 'react'

export default function Figure({ dim, x, y, color, className, scaledDim, opacity }) {
    const shape = className.split(' ')[0];

    switch(shape) {
        case 'line':
            return (
                <div 
                    className={className}
                    style={{ 
                            height: `${10}px`,
                            width: `${dim * 4 *  Math.sin(y / x)}px`,
                            top: `${y}px`,
                            left: `${x}px`,
                            opacity: opacity,
                            background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                            }} >
                    
                </div>
            )
        case 'image':
            return (
                <div 
                    className={className}
                    style={{ 
                            height: `${dim}px`,
                            width: `${dim}px`,
                            top: `${y}px`,
                            left: `${x}px`,
                            opacity: opacity,
                            }} >
                    <img src={`https://picsum.photos/${dim}`} alt="random pic from API" style={{ height: '100%', width: '100%'}} type="image/*" />
                </div>
            )
        default:
            return(
                <div 
                    className={className}
                    style={{ 
                            // activate as option
                            // height: `${Math.random() * (0.99 * dim) + 0.99 * dim}px`, 
                            // width: `${Math.random() * (0.99 * dim) + 0.99 * dim}px`, 
                            height: `${dim}px`, 
                            width: `${dim}px`, 
                            top: `${y}px`,
                            left: `${x}px`,
                            opacity: opacity,
                            background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                            mixBlendMode: "difference",
                            }} > 
                </div>
            )
    }
}
