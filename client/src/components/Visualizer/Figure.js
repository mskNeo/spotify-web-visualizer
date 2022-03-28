// uses https://random.responsiveimages.io/

import React from 'react'

export default function Figure({ dim, x, y, color, className }) {
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
                            }} >
                    <img src={`https://random.imagecdn.app/${dim}/${dim}`} alt="random pic from API" />
                </div>
            )
        default:
            return(
                <div 
                    className={className}
                    style={{ 
                            // height: `${Math.random() * (0.99 * dim) + 0.99 * dim}px`, 
                            // width: `${Math.random() * (0.99 * dim) + 0.99 * dim}px`, 
                            height: `${dim}px`, 
                            width: `${dim}px`, 
                            top: `${y}px`,
                            left: `${x}px`,
                            background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                            mixBlendMode: "difference",
                            }} > 
                </div>
            )
    }
}
