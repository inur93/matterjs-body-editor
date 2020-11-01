import { useState } from "react";
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";
import { ShapeAddedEvent } from '../events/ShapeAddedEvent';
import { ShapesChangedEvent } from '../events/ShapesChangedEvent';
import { useEventSubscriber } from './useEventSubscriber';
import { useLocalStorage } from './useLocalStorage';

export enum ShapeAction {
    ADD, REMOVE, UPDATE
}

export const useShapes = (): UseShapesType => {
    const [shapes, setShapes] = useLocalStorage<MBE.Shape[]>('shapes', []);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

    useEventSubscriber(EventType.SHAPES_CHANGED, (evt: ShapesChangedEvent) => setShapes(evt.shapes));

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