
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { KonvaEventObject, Node, NodeConfig } from 'konva/types/Node';
import { Vector2d } from 'konva/types/types';
import React, { useState } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import { ShapeAddEnabledEvent } from '../events/ShapeAddEnabledEvent';
import { ToggleDragEvent } from '../events/ToggleDragEvent';
import { useEventSubscriber } from '../hooks/useEventSubscriber';
import { useGuides } from '../hooks/useGuides';
import { useKeyDownListener } from '../hooks/useKeyDownListener';
import useKeyListener from '../hooks/useKeyListener';
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { ShapeAction, useShapes } from '../hooks/useShapes';
import { useViewport } from '../hooks/useViewport';
import { Backdrop } from './Backdrop';
import { Circle } from './shapes/Circle';
import { Polygon } from './shapes/Polygon';
import { Rectangle } from './shapes/Rectangle';
import { Guide } from './transform/Guide';
import { RectangleTransform } from './transform/RectangleTransform';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        "root": {
            "z-index": 1033,
            position: "absolute"
        }
    }),
);

export default function Canvas() {
    const classes = useStyles();
    const [dimensions] = useScreenDimensions();
    const [shapeToAdd, setShapeToAdd] = useState<string | undefined>();
    const [shapes, selectedShapes, shapeActions] = useShapes();
    const [viewport, vpActions] = useViewport();
    const [drag, setDrag] = useState(false);
    const [guides, onDrag, onDragEnd] = useGuides();
    const [ctrlDown] = useKeyDownListener('Control');
    // const [currentShapePosition, setCurrentShapePosition] = useState<Vector2d>();
    const [trNode, setTrNode] = useState<Node<NodeConfig>>();

    useKeyListener('Delete', () => {
        shapes.filter(x => selectedShapes.includes(x.id))
            .forEach(s => shapeActions.updateShape(ShapeAction.REMOVE, s));
        setTrNode(undefined);
    });

    useEventSubscriber(ToggleDragEvent.type, (evt: ToggleDragEvent) => {
        setDrag(evt.enabled);
    });

    useEventSubscriber(ShapeAddEnabledEvent.type, (evt: ShapeAddEnabledEvent) => {
        setShapeToAdd(evt.shapeType);
    });

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

    return (<Stage className={classes.root} width={dimensions.width} height={dimensions.height}
        dragBoundFunc={(pos: Vector2d) => {
            //TODO get map dimensions
            const width = 640 * viewport.scale.x;
            const height = 640 * viewport.scale.y;

            const x_min = Math.min(dimensions.width - width, 0);
            const x_max = Math.max(dimensions.width - width, 0);

            const y_min = Math.min(dimensions.height - height, 0);
            const y_max = Math.max(dimensions.height - height, 0);

            if (pos.x < x_min) pos.x = x_min;
            else if (pos.x > x_max) pos.x = x_max;

            if (pos.y < y_min) pos.y = y_min;
            else if (pos.y > y_max) pos.y = y_max;
            return pos;
        }}
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
        <Layer onDragMove={onDrag} onDragEnd={onDragEnd} onClick={selectShape}>
            {(shapes || []).map((x, i) => (
                <Component
                    key={x.id}
                    data={x}
                    props={{
                        data: x,
                        isSelected: selectedShapes.includes(x.id),
                        onChange: onShapeChange
                    }
                    }
                />))}

        </Layer>
        <Layer>
            <RectangleTransform node={trNode} />
            {
                (guides || []).map((guide) => <Guide guide={guide} scale={viewport.scale} offset={viewport.offset} />)
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
