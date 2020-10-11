import React, { useState } from 'react';
import { Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';


export const Anchor = ({ id, x, y, labelText, onDrag }: AnchorProps) => {
    const [showLabel, setShowLabel] = useState(false);
    const [position, setPosition] = useState({ x: x - 5, y: y - 5 });

    const handleDrag = (type: MBE.DragType) =>
        (evt: KonvaEventObject<DragEvent>) => {
            setShowLabel(type !== 'end');
            const x = evt.target.x(), y = evt.target.y();
            onDrag({ x, y });
            if (type === 'end') {
                setPosition({ x, y });
            }
        }
    return <React.Fragment>
        <Rect stroke="red"
            strokeWidth={2}
            key={id}
            draggable
            onDragStart={handleDrag('start')}
            onDragMove={handleDrag('move')}
            onDragEnd={handleDrag('end')}
            x={position.x}
            y={position.y}
            width={10}
            height={10} />
        {showLabel && <Text strokeWidth={1} stroke="black" x={x + 5} y={y - 10} text={labelText} />}
    </React.Fragment>
}

type AnchorProps = {
    id: string,
    x: number,
    y: number,
    labelText: string,
    onDrag: (position: Vector) => void
}