import { useCallback, useState } from "react";
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";
import { ShapeAddedEvent } from '../events/ShapeAddedEvent';
import { ShapesChangedEvent } from '../events/ShapesChangedEvent';
import { ShapesSelectedEvent } from "../events/ShapesSelectedEvent";
import { useEventSubscriber } from './useEventSubscriber';
import { useLocalStorage } from './useLocalStorage';

export enum ShapeAction {
    ADD, REMOVE, UPDATE
}

const selectShapes = (selected: string[]) => {
    EventDispatcher.dispatch(new ShapesSelectedEvent(selected));
};
export const useShapes = (): UseShapesType => {
    const [shapes, setShapes] = useLocalStorage<MBE.Shape[]>('shapes', []);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

    useEventSubscriber(EventType.SHAPES_CHANGED, (evt: ShapesChangedEvent) => setShapes(evt.shapes));
    useEventSubscriber(EventType.SHAPES_SELECTED, (evt: ShapesSelectedEvent) => setSelectedShapes(evt.shapes));

    const updateShape = useCallback((action: ShapeAction, shape: MBE.Shape) => {
        let updated;
        switch (action) {
            case ShapeAction.ADD:
                updated = [...shapes, shape];
                EventDispatcher.dispatch(new ShapeAddedEvent(shape));
                break;
            case ShapeAction.REMOVE:
                updated = shapes.filter(x => x.id !== shape.id);
                selectShapes([]);
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
    }, [shapes]);



    return [shapes, selectedShapes, updateShape, selectShapes]
}

type UseShapesType = [
    MBE.Shape[],
    string[],
    (action: ShapeAction, shape: MBE.Shape) => void,
    (shapes: string[]) => void
]