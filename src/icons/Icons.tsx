
import React from 'react';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import PanToolOutlinedIcon from '@material-ui/icons/PanToolOutlined';
const strokeWidth = 8;

export const Square = () => {

    return (<svg xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio="preserve">
        <g transform="translate(0,0)">
            <path d="M20 20 L20 180 L180 180 L180 20 Z" strokeWidth={strokeWidth} stroke='black' fill="transparent" />
            <path d="M5 5 L5 35 L35 35 L35 5 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
            <path d="M165 5 L165 35 L195 35 L195 5 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
            <path d="M165 165 L165 195 L195 195 L195 165 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
            <path d="M35 165 L35 195 L5 195 L5 165 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
        </g>
    </svg>)
}

export const Triangle = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio="preserve">
        <g transform="translate(0,0)">
            {/* square */}
            <path d="M20 20 L180 20 L180 180 Z" strokeWidth={strokeWidth} stroke='black' fill="transparent" />
            {/* top left square */}
            <path d="M5 5 L5 35 L35 35 L35 5 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
            {/* top right square */}
            <path d="M165 5 L165 35 L195 35 L195 5 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
            {/* bottom right square */}
            <path d="M165 165 L165 195 L195 195 L195 165 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
        </g>
    </svg>)
}

export const Circle = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio="preserve">
        <g transform="translate(0,0)">
            <circle fill="transparent" r="90" cx="100" cy="100" strokeWidth={strokeWidth} stroke="black" />
            <path d="M85 85 L115 85 L115 115 L85 115 Z" stroke='red' strokeWidth={strokeWidth} fill="transparent" />
        </g>
    </svg>)
}

export const MousePointer = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg"
        height="100%"
        width="100%"
        viewBox="0 0 200 200"
        preserveAspectRatio="preserve">
        <g transform="translate(0,0)">
            {/* square */}
            <path d="M20 20 L180 80 L120 120 20 180 Z" strokeWidth={strokeWidth} stroke='black' fill="transparent" />
        </g>
    </svg>)
}

export const ImageUpload = () => {
    return <WallpaperIcon style={{width: '100%', height: '100%'}} />
}

export const Hand = () => {
    return <PanToolOutlinedIcon style={{width: '100%', height: '100%'}} />
}