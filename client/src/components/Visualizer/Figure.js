import React from 'react'

export default function Figure({ dim, x, y, color, className }) {
    const lineHeight = Math.random() * (15 - 5) + 5;
    return (
        <div>
        { className.includes("line")
            ? 
            <div 
                className={className}
                style={{ 
                        height: `${lineHeight}px`,
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