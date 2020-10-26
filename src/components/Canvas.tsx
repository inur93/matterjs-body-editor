
import { Layer as KonvaLayer } from 'konva/types/Layer';
import { KonvaEventObject, Node, NodeConfig } from 'konva/types/Node';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Layer, Line, Stage, Text } from 'react-konva';
import EventDispatcher from '../events/EventDispatcher';
import { ShapeAddEnabledEvent } from '../events/ShapeAddEnabledEvent';
import { ToggleDragEvent } from '../events/ToggleDragEvent';
import { useGuides } from '../hooks/useGuides';
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { ShapeAction, useShapes } from '../hooks/useShapes';
import { useViewport } from '../hooks/useViewport';
import { Circle } from '../shapes/Circle';
import { Polygon } from '../shapes/Polygon';
import { Rectangle } from '../shapes/Rectangle';
import { Backdrop } from './Backdrop';
import { useKeyDownListener } from '../hooks/useKeyDownListener';
import useKeyListener from '../hooks/useKeyListener';
import { TestApp } from './Test';
import { RectangleTransform } from './RectangleTransform';
import Konva from 'konva';
import { Vector2d } from 'konva/types/types';



export const Canvas = () => {
    const [dimensions] = useScreenDimensions();
    const [shapeToAdd, setShapeToAdd] = useState<string | undefined>();
    const [shapes, selectedShapes, shapeActions] = useShapes();
    const [viewport, vpActions] = useViewport();
    const [drag, setDrag] = useState(false);
    const [guides, onDrag, onDragEnd] = useGuides();
    const [ctrlDown] = useKeyDownListener('Control');
    const [currentShapePosition, setCurrentShapePosition] = useState<Vector2d>();
    const [trNode, setTrNode] = useState<Node<NodeConfig>>();
    useKeyListener('Delete', () => {
        shapes.filter(x => selectedShapes.includes(x.id))
            .forEach(s => shapeActions.updateShape(ShapeAction.REMOVE, s));
        setTrNode(undefined);
    });

    const toggleDragListener = (evt: ToggleDragEvent) => {
        setDrag(evt.enabled);
    }

    const setShapeToAddListener = (evt: ShapeAddEnabledEvent) => {
        setShapeToAdd(evt.shapeType);
    }

    useEffect(() => {
        const diposers = [
            // EventDispatcher.subscribe(ShapeSelectedEvent.type, selectedShapeListener),
            EventDispatcher.subscribe(ToggleDragEvent.type, toggleDragListener),
            EventDispatcher.subscribe(ShapeAddEnabledEvent.type, setShapeToAddListener)
        ]

        return () => diposers.forEach(x => x());
    }, []);

    const onCanvasClick = (evt: KonvaEventObject<MouseEvent>) => {
        var transform = evt.target.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();


        // get pointer (say mouse or touch) position
        const absolutePosition = evt.target.getStage()?.getPointerPosition() || { x: 0, y: 0 };
        const relativePosition = transform.point(absolutePosition);

        if (shapeToAdd) {
            let shape: MBE.Shape;
            if (shapeToAdd === 'circle') shape = Circle.create(`${Date.now()}`, relativePosition);
            else if (shapeToAdd === 'rectangle') shape = Rectangle.create(`${Date.now()}`, relativePosition);
            else {
                console.log('unknown shape', shapeToAdd);
                return;
            }
            shapeActions.updateShape(ShapeAction.ADD, shape);
        }
    }

    const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        // deselect when clicked on empty area on stage or the background image
        const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.image;
        if (clickedOnEmpty) {
            setTrNode(undefined);
            shapeActions.setSelectedShapes([]);
        }
    };

    const onShapeChange = (shape: MBE.Shape) => {
        shapeActions.updateShape(ShapeAction.UPDATE, shape);
    }

    const selectShape = (e: KonvaEventObject<MouseEvent>) => {
        const target = e.target;
        const id = target.name();
        setTrNode(target);
        if (ctrlDown) {
            shapeActions.setSelectedShapes([...selectedShapes, id]);
        } else {
            shapeActions.setSelectedShapes([id]);
        }

    }

    return (<Stage className="canvas" width={dimensions.width} height={dimensions.height}
        draggable={drag}
        onDragEnd={vpActions.onPanEnd}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        scale={viewport.scale}
        onClick={onCanvasClick}
        onWheel={(evt => vpActions.updateScale(evt.evt.deltaY))}
    >

        <Layer onClick={checkDeselect}>
            <Backdrop onClick={checkDeselect} />
        </Layer>
        <Grid stagePos={viewport.offset} scale={viewport.scale} dimensions={dimensions} />
        <Layer onDragMove={e => {
            onDrag(e);
            // setCurrentShapePosition(e.target.getPosition());
        }} onDragEnd={onDragEnd} onClick={selectShape}>
            {(shapes || []).map((x, i) => <Component key={x.id}
                data={x}
                props={{
                    data: x,
                    isSelected: selectedShapes.includes(x.id),
                    onChange: onShapeChange
                }
                }
            />)}

        </Layer>
        <Layer>
            <Text
                x={viewport.offset.x / viewport.scale.y}
                y={(viewport.offset.y + dimensions.height) / viewport.scale.y - 30}
                stroke="black"
                strokeWidth={1}
                text={`(${Math.round(currentShapePosition?.x || 0)},${Math.round(currentShapePosition?.y || 0)})`}
            />
            <RectangleTransform node={trNode} />
            {
                (guides || []).map((guide) => {
                    const baseProps = {
                        key: guide.orientation,
                        name: 'guide',
                        stroke: 'rgb(0, 161, 255)',
                        strokeWidth: 1,
                        dash: [4, 6]
                    }
                    if (guide.orientation === 'H') {
                        return <Line {...baseProps} y={(guide.lineGuide - viewport.offset.y) * 1 / viewport.scale.y} points={[-6000, 0, 6000, 0]} />
                    } else if (guide.orientation === 'V') {
                        return <Line {...baseProps} x={(guide.lineGuide - viewport.offset.x) * 1 / viewport.scale.x} points={[0, -6000, 0, 6000]} />
                    } else {
                        return null;
                    }
                })
            }
        </Layer>
    </Stage>)
}

const Component = ({ props, data }: MBE.ShapeComponent<MBE.Shape>) => {

    switch (data.type) {
        case "rectangle":
            return <Rectangle {...props} data={data as MBE.Rectangle} />;
        case "polygon":
            return <Polygon {...props} data={data as MBE.Polygon} />;
        case "circle":
            return <Circle {...props} data={data as MBE.Circle} />;
    }
    return null;
}


const Grid = ({ stagePos, scale, dimensions }: { stagePos: Vector2d, scale: Vector2d, dimensions: { width: number, height: number } }) => {
    const WIDTH = scale.x < 2 ? 10 : 5;
    const HEIGHT = scale.y < 2 ? 10 : 5;
    const scaledWidth = 640;
    const scaledHeight = 640;
    const startX = Math.floor((-stagePos.x - scaledWidth) / WIDTH) * WIDTH;
    const endX = Math.floor((-stagePos.x + scaledWidth * 2) / WIDTH) * WIDTH;

    const startY = Math.floor((-stagePos.y - scaledHeight) / HEIGHT) * HEIGHT;
    const endY = Math.floor((-stagePos.y + scaledHeight * 2) / HEIGHT) * HEIGHT;

    const gridComponents = [];

    //vertical lines
    for (let x = startX; x < endX; x += WIDTH) {
        gridComponents.push(<Line name='guide' key={`(${x},${startY})-(${startY},${endY})`} stroke='#CCCCCC' strokeWidth={0.5} points={[x, startY, x, endY]} />);
    }
    //horizontal lines
    for (var y = startY; y < endY; y += HEIGHT) {
        gridComponents.push(<Line name='guide' key={`(${startX},${y})-(${endX},${y})`} stroke='#CCCCCC' strokeWidth={0.5} points={[startX, y, endX, y]} />);
    }

    return <Layer>
        {gridComponents}
    </Layer>
}
