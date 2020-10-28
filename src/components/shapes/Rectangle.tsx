import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { Vector2d } from 'konva/types/types';
import React from 'react';
import { Rect } from 'react-konva';
import { useShapeColor } from '../../hooks/useShapeColor';


const handleTransformEnd = (ref: React.MutableRefObject<Konva.Rect>,
    onChange: MBE.ShapeOnChange<MBE.Rectangle>,
    data: MBE.Rectangle) =>
    (e: KonvaEventObject<Event>) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        const node = ref.current;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        console.log('node', node.toJSON());
        onChange({
            ...data,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            // set minimal value
            width: Math.round(Math.max(5, node.width() * scaleX)),
            height: Math.round(Math.max(5, node.height() * scaleY))
        });
    }

const handleDragEnd = (onChange: MBE.ShapeOnChange<MBE.Rectangle>, data: MBE.Rectangle) => (e: KonvaEventObject<Event>) => {
    onChange({
        ...data,
        x: Math.round(e.target.x()),
        y: Math.round(e.target.y())
    })
}
export const Rectangle = (props: MBE.RectangleProps) => {
    const shapeRef = React.useRef<Konva.Rect>() as React.MutableRefObject<Konva.Rect>;

    const [color] = useShapeColor();
    const { width, height } = props.data;

    const x = props.data.x;
    const y = props.data.y;

    console.log('dimensions', { x, y, width, height });
    return <React.Fragment>
        <Rect
            name={props.data.id}
            draggable
            stroke={color}
            strokeWidth={2}
            strokeScaleEnabled={false}
            ref={shapeRef}
            onTransformEnd={handleTransformEnd(shapeRef, props.onChange, props.data)}
            onDragEnd={handleDragEnd(props.onChange, props.data)}
            {...{ x, y, width, height }}
        />
    </React.Fragment>
}

Rectangle.create = (id: string, position: Vector2d): MBE.Rectangle => {
    return {
        type: 'rectangle',
        id,
        x: position.x,
        y: position.y,
        width: 50,
        height: 50
    }
}