
import React, { useEffect, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { useScreenDimensions } from '../hooks/useScreenDimensions';
import { Polygon } from '../shapes/Polygon';
import { Rectangle } from '../shapes/Rectangle';
import { Circle } from '../shapes/Circle';
import { KonvaEventObject } from 'konva/types/Node';
import { ShapeSelectedEvent } from '../events/ShapeSelectedEvent';
import EventDispatcher from '../events/EventDispatcher';
import { useShapes } from '../hooks/useShapes';
import { useScale } from '../hooks/useScale';
import { ToggleDragEvent } from '../events/ToggleDragEvent';
import { Backdrop } from './Backdrop';

export const Canvas = () => {
    const [dimensions] = useScreenDimensions();
    const [shapeToAdd, setShapeToAdd] = useState<string | undefined>();
    const [selectedId, setSelected] = useState<string | null>(null);
    const [shapes, updateShape] = useShapes();
    const [, setScale] = useScale();
    const [drag, setDrag] = useState(false);

    const selectedShapeListener = (evt: ShapeSelectedEvent) => {
        if (evt.selected) {
            setShapeToAdd(evt.shape?.type);
        } else {
            setShapeToAdd(undefined);
        }
    }

    const toggleDragListener = (evt: ToggleDragEvent) => {
        setDrag(evt.enabled);
    }


    //component did mount
    useEffect(() => {
        const diposers = [
            EventDispatcher.subscribe(ShapeSelectedEvent.type, selectedShapeListener),
            EventDispatcher.subscribe(ToggleDragEvent.type, toggleDragListener)
        ]

        return () => diposers.forEach(x => x());
    }, []);

    const onCanvasClick = (evt: KonvaEventObject<MouseEvent>) => {
        // var transform = evt.target.getAbsoluteTransform().copy();
        // // to detect relative position we need to invert transform
        // transform.invert();

        // get pointer (say mouse or touch) position
        var pos = evt.target.getStage()?.getPointerPosition();

        const x = pos?.x ?? 0;
        const y = pos?.y ?? 0;
        if (shapeToAdd) {
            let shape: MBE.Shape;
            if (shapeToAdd === 'circle') shape = Circle.create(`${Date.now()}`, x, y);
            else if (shapeToAdd === 'rectangle') shape = Rectangle.create(`${Date.now()}`, x, y);
            else {
                console.log('unknown shape', shapeToAdd);
                return;
            }
            updateShape(MBE.ShapeAction.ADD, shape);
        }
    }

    const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelected(null);
        }
    };

    const onDrag = (evt: KonvaEventObject<DragEvent>) => {
        
    }

    return (<Stage className="canvas" width={dimensions.width} height={dimensions.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        onDragMove={onDrag}
        onClick={onCanvasClick}
        onWheel={(evt => setScale(evt.evt.deltaY))}
    >
        <Layer>
            <Backdrop />
            {shapes.map((x, i) => <Component key={x.id}
                data={x}
                props={{
                    data: x,
                    isSelected: x.id === selectedId,
                    onSelect: () => setSelected(x.id),
                    onChange: (data => {
                        const sliced = shapes.slice();
                        sliced[i] = data;
                        // setShapes(sliced);
                    })
                }
                }
            />)}
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