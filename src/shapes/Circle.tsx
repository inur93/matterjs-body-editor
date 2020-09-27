
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import React, { useEffect, useState } from 'react';
import { Circle as CircleKonva } from 'react-konva';
import { Anchor } from '../components/Anchor';

//https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
const dist = (p1: Vector, p2: Vector, d: Vector) => {
    return Math.abs((p2.y - p1.y) * d.x - (p2.x - p1.x) * d.y + p2.x * p1.y - p2.y * p1.x)
        / Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2))
}


const handleShapeMove = (onChange: ShapeOnChange<CircleType>, props: CircleType) => (e: KonvaEventObject<Event>) => {
    onChange({
        ...props,
        x: e.target.x(),
        y: e.target.y()
    })
}

const handleAnchorChange = (onChange: ShapeOnChange<CircleType>, props: CircleType) =>
    (position: Vector) => {
        const { y } = props;

        let r = Math.abs(y - position.y) - 5;
        if (r < 10) r = 10;

        onChange({ ...props, r: r });
    }

export const Circle = (props: CircleProps) => {
    const shapeRef = React.useRef<Konva.Circle>() as React.MutableRefObject<Konva.Circle>;
    const trRef = React.useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const { r, x, y } = props.data;
    useEffect(() => {
        if (props.isSelected) {
            trRef.current?.setNode(shapeRef.current);
            trRef.current?.getLayer()?.batchDraw();
        }
    }, [props.isSelected])

    return <React.Fragment>

        <CircleKonva
            draggable
            stroke="black"
            strokeWidth={2}
            x={x}
            y={y}
            radius={r}
            ref={shapeRef}

            onDragMove={handleShapeMove(props.onChange, props.data)}
            onDragEnd={handleShapeMove(props.onChange, props.data)}
            onClick={() => props.onSelect(props.data.id)}
        />
        {props.isSelected && <Anchor
            id={`${props.data.id}-radius`}
            x={x}
            y={y - r}
            labelText={`r=${r}`}
            onDrag={handleAnchorChange(props.onChange, props.data)}
        />
        }
    </React.Fragment>
}