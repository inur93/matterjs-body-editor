
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { Vector2d } from 'konva/types/types';
import React, { useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';
import { useShapeColor } from '../hooks/useShapeColor';


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
        // node.strokeWidth(2);
        // node.setAttrs({
        //     strokeWidth: 4
        // })
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
    console.log('handle drag event');
    onChange({
        ...data,
        x: e.target.x(),
        y: e.target.y()
    })
}
export const Rectangle = (props: MBE.RectangleProps) => {
    const shapeRef = React.useRef<Konva.Rect>() as React.MutableRefObject<Konva.Rect>;
    const trRef = React.useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const [color] = useShapeColor();
    const { width, height } = props.data;

    const x = props.data.x;
    const y = props.data.y;

    useEffect(() => {
        if (props.isSelected) {
            trRef.current?.nodes([shapeRef.current]);
            //shows the shape as selected right away.
            trRef.current?.getLayer()?.batchDraw();
            // trRef.current?.ignoreStroke(false);
            // shapeRef.current?.strokeScaleEnabled(false);
        }
    }, [props.isSelected, trRef, shapeRef])

    console.log('dimensions', { x, y, width, height });
    return <React.Fragment>
        <Rect
            draggable
            stroke={color}
            strokeWidth={2}

            ref={shapeRef}
            onClick={() => props.onSelect(props.data.id)}
            onTransformEnd={handleTransformEnd(shapeRef, props.onChange, props.data)}
            
            onDragEnd={handleDragEnd(props.onChange, props.data)}
            {...{ x, y, width, height }}
        />
        {props.isSelected &&
            <Transformer
                ref={trRef}
                onTransform={(e) => {
                    const tr = e.currentTarget;
                    console.log('dims', {
                        x: tr.x(),
                        y: tr.y()
                    })
                }}
                boundBoxFunc={(oldbox, newbox) => {
                    if (newbox.width < 5 || newbox.height < 5) {
                        return oldbox;
                    }
                    newbox.x = Math.round(newbox.x);
                    newbox.y = Math.round(newbox.y);
                    newbox.width = Math.round(newbox.width);
                    newbox.height = Math.round(newbox.height);
                    return newbox;
                }}
            />}
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