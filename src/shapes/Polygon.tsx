
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import React, { useEffect, useState } from 'react';
import { Rect, Shape, Text, Transformer } from 'react-konva';
import { Anchor } from '../components/Anchor';
import { useShapeColor } from '../hooks/useShapeColor';

//https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
const dist = (p1: Vector, p2: Vector, d: Vector) => {
    return Math.abs((p2.y - p1.y) * d.x - (p2.x - p1.x) * d.y + p2.x * p1.y - p2.y * p1.x)
        / Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2))
}

const handleAddVertice = (onChange: MBE.ShapeOnChange<MBE.Polygon>, data: MBE.Polygon) => (evt: KonvaEventObject<MouseEvent>) => {
    const { vertices } = data;
    const { x, y } = evt.evt;
    let min = Number.MAX_SAFE_INTEGER;
    let position = 0;
    vertices.forEach((v, i) => {
        const v1 = vertices[(i + 1) % vertices.length];
        const p0 = v;
        const p1 = { x: data.x + v1.x, y: data.y + v1.y };
        const d = dist(p0, p1, { x, y });
        if (d < min) {
            position = i;
            min = d;
        }
    })
    const newVertices = vertices.slice();
    newVertices.splice(position + 1, 0, { x: x - data.x, y: y - data.y });
    onChange({ ...data, vertices: newVertices });
}

const handleShapeMove = (onChange: MBE.ShapeOnChange<MBE.Polygon>, data: MBE.Polygon) => (e: KonvaEventObject<Event>) => {
    onChange({
        ...data,
        x: e.target.x(),
        y: e.target.y()
    })
}

const handleAnchorChange = (onChange: MBE.ShapeOnChange<MBE.Polygon>, data: MBE.Polygon, index: number,
    setLabel: React.Dispatch<React.SetStateAction<[number, number]>>) =>
    (position: Vector) => {

        setLabel([position.x + 20 + 5, position.y + 5]);

        const { vertices, x, y } = data;
        const newVertices = vertices.slice();
        newVertices.splice(index, 1, { x: position.x - x + 5, y: position.y - y + 5 });
        onChange({ ...data, vertices: newVertices });
    }

export const Polygon = (props: MBE.PolygonProps) => {
    const shapeRef = React.useRef<Konva.Rect>() as React.MutableRefObject<Konva.Rect>;
    const trRef = React.useRef<Konva.Transformer>() as React.MutableRefObject<Konva.Transformer>;
    const [color] = useShapeColor();
    const { vertices, x, y } = props.data;
    const [posLabel, setPosLabel] = useState<[number, number]>([0, 0]);
    useEffect(() => {
        if (props.isSelected) {
            trRef.current?.setNode(shapeRef.current);
            trRef.current?.getLayer()?.batchDraw();
        }
    }, [props.isSelected])

    return <React.Fragment>
        <Shape
            draggable
            stroke={color}
            strokeWidth={2}
            x={x}
            y={y}
            ref={shapeRef}
            sceneFunc={(context: any, shape: any) => {
                context.beginPath();
                // context.moveTo(0, 0);
                vertices.forEach((val, i) => {

                    if (i) context.lineTo(val.x, val.y);
                    else context.moveTo(val.x, val.y); //first point
                })

                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
            }}
            onDragEnd={handleShapeMove(props.onChange, props.data)}
            onClick={() => props.onSelect(props.data.id)}
            onDblClick={handleAddVertice(props.onChange, props.data)}


        />
        <Transformer ref={trRef}  />
        {props.isSelected && <React.Fragment>
            {vertices.map((v, i) => <Anchor id={`${props.data.id}-${i}`}
                x={x + v.x}
                y={y + v.y}
                labelText={`x=${posLabel[0]} y=${posLabel[1]}`}
                onDrag={handleAnchorChange(props.onChange, props.data, i, setPosLabel)}
            />)}
        </React.Fragment>
        }
    </React.Fragment>
}