import React from 'react'

export default function Figure({ dim, x, y, color, className }) {
    return (
        <div>
        { className.includes("line")
            ? 
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
            :
            <div 
                className={className}
                style={{ 
                        height: `${dim}px`, 
                        width: `${dim}px`, 
                        top: `${y}px`,
                        left: `${x}px`,
                        background: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        }} >
                
            </div>
        }
        </div>
    )
}
