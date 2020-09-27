
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import React, { useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';


const handleTransformEnd = (ref: React.MutableRefObject<Konva.Rect>,
    onChange: ShapeOnChange<RectangleType>,
    shapeProps: RectangleType) =>
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
        onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
        });
    }

const handleDragEnd = (onChange: ShapeOnChange<RectangleType>, props: RectangleType) => (e: KonvaEventObject<Event>) => {
    onChange({
        ...props,
        x: e.target.x(),
        y: e.target.y()
    })
}
export const Rectangle = (props: RectanglePropsType) => {
    const shapeRef = React.useRef<Konva.Rect>() as React.MutableRefObject<Konva.Rect>;
    const trRef = React.useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const { x, y, width, height } = props.data;

    useEffect(() => {
        if (props.isSelected) {
            trRef.current?.setNode(shapeRef.current);
            trRef.current?.getLayer()?.batchDraw();
        }
    }, [props.isSelected])

    return <React.Fragment>

        <Rect
            draggable
            stroke="black"
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
                boundBoxFunc={(oldbox, newbox) => {
                    if (newbox.width < 5 || newbox.height < 5) {
                        return oldbox;
                    }
                    return newbox;
                }}
            />}
    </React.Fragment>
}