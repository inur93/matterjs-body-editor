
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import React, { useEffect } from 'react';
import { Ellipse as EllipseKonva, Transformer } from 'react-konva';
import { useShapeColor } from '../hooks/useShapeColor';
import { Vector2d } from 'konva/types/types';

const handleShapeMove = (onChange: MBE.ShapeOnChange<MBE.Circle>,
    data: MBE.Circle) => (e: KonvaEventObject<Event>) => {
        onChange({
            ...data,
            x: e.target.x(),
            y: e.target.y()
        })
    }

const handleTransformEnd = (ref: React.MutableRefObject<Konva.Ellipse>,
    onChange: MBE.ShapeOnChange<MBE.Circle>,
    data: MBE.Circle) =>
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
            ...data,
            x: node.x(),
            y: node.y(),
            angle: node.rotation(),
            rX: node.radiusX() * scaleX,
            rY: node.radiusY() * scaleY
        });
    }

export const Circle = (props: MBE.CircleProps) => {
    const shapeRef = React.useRef<Konva.Ellipse>() as React.MutableRefObject<Konva.Ellipse>;
    const trRef = React.useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const [color] = useShapeColor();
    const { rX, rY, x, y } = props.data;
    useEffect(() => {
        if (props.isSelected) {
            trRef.current?.nodes([shapeRef.current]);
            trRef.current?.getLayer()?.batchDraw();
        }
    }, [props.isSelected, shapeRef, trRef])

    return <React.Fragment>

        <EllipseKonva
            draggable
            stroke={color}
            strokeWidth={2}
            x={x}
            y={y}
            radiusX={rX}
            radiusY={rY}
            ref={shapeRef}
            onDragEnd={handleShapeMove(props.onChange, props.data)}
            
            onTransformEnd={handleTransformEnd(shapeRef, props.onChange, props.data)}
        />

        <Transformer ref={trRef} rotateEnabled={false}
            enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right'
            ]} />
    </React.Fragment>
}

Circle.create = (id: string, position: Vector2d): MBE.Circle => {
    return {
        type: 'circle',
        angle: 0,
        id,
        x: position.x,
        y: position.y,
        rX: 50,
        rY: 50
    }
}