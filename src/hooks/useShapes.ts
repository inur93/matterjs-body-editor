import { useEffect, useState } from "react";
import EventDispatcher from "../events/EventDispatcher";
import { loadLsJson } from "../helperFunctions";
import { ShapesChangedEvent } from '../events/ShapesChangedEvent';
import { ShapeAddedEvent } from '../events/ShapeAddedEvent';

export enum ShapeAction {
    ADD, REMOVE, UPDATE
}

export const useShapes = (): UseShapesType => {
    const [shapes, setShapes] = useState<MBE.Shape[]>(loadLsJson<MBE.Shape[]>('shapes') || []);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

    const listener = (evt: ShapesChangedEvent) => {
        setShapes(evt.shapes);
    }

    useEffect(() => {
        return EventDispatcher.subscribe(ShapesChangedEvent.type, listener);
    }, []);

    useEffect(() => {
        localStorage.setItem('shapes', JSON.stringify(shapes));
    }, [shapes])
    const updateShape = (action: ShapeAction, shape: MBE.Shape) => {
        let updated;
        switch (action) {
            case ShapeAction.ADD:
                updated = [...shapes, shape];
                break;
            case ShapeAction.REMOVE:
                updated = shapes.filter(x => x.id !== shape.id);
                break;
            case ShapeAction.UPDATE:
                const copy = shapes.slice();
                const index = copy.findIndex(x => x.id === shape.id);
                copy.splice(index, 1, shape);
                updated = copy;
                break;
        }

        if (updated) {
            EventDispatcher.dispatch(new ShapesChangedEvent(updated));
        }
        if (action === ShapeAction.ADD) {
            EventDispatcher.dispatch(new ShapeAddedEvent(shape));
        }

    }

    return [shapes, selectedShapes, {
        updateShape,
        setSelectedShapes
    }]
}

type UseShapesType = [MBE.Shape[], string[],
    {
        updateShape: (action: ShapeAction, shape: MBE.Shape) => void,
        setSelectedShapes: (shapes: string[]) => void
    }
]