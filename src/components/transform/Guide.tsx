import React from 'react';
import { Vector2d } from 'konva/types/types';
import { Line } from 'react-konva';


export const Guide = ({ guide, offset, scale }: GuideProps) => {
    const baseProps = {
        key: guide.orientation,
        name: 'guide',
        stroke: 'rgb(0, 161, 255)',
        strokeWidth: 1,
        dash: [4, 6],
        points: guide.orientation === 'H' ? [-6000, 0, 6000, 0] : [0, -6000, 0, 6000]
    }
    if (guide.orientation === 'H') {
        return <Line {...baseProps} y={(guide.lineGuide - offset.y) * 1 / scale.y} />
    } else {
        return <Line {...baseProps} x={(guide.lineGuide - offset.x) * 1 / scale.x} />
    }
}

type GuideProps = {
    guide: MBE.GuideType,
    offset: Vector2d,
    scale: Vector2d
}