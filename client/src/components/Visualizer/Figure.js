import React from 'react'

export default function Figure({ dim, x, y, color, className }) {
    return (
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
    )
}
