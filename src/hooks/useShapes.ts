import { useEffect, useState } from "react";
import EventDispatcher from "../events/EventDispatcher";
import { loadLsJson } from "../helperFunctions";
import { ShapesChangedEvent } from '../events/ShapesChangedEvent';


export const useShapes = (): UseShapesType => {
    const [shapes, setShapes] = useState<MBE.Shape[]>(loadLsJson<MBE.Shape[]>('shapes') || []);

    const listener = (evt: ShapesChangedEvent) => {
        setShapes(evt.shapes);
    }
    useEffect(() => {
        const rectangle = {
            id: 'test',
            type: 'rectangle',
            x: 50,
            y: 50,
            width: 100,
            height: 100
        };
        setShapes([rectangle as MBE.Rectangle]);
        return EventDispatcher.subscribe(ShapesChangedEvent.type, listener);
    }, []);
    const updateShape = (action: MBE.ShapeAction, shape: MBE.Shape) => {
        let updated;
        switch (action) {
            case MBE.ShapeAction.ADD:
                updated = [...shapes, shape]
                break;
            case MBE.ShapeAction.REMOVE:
            case MBE.ShapeAction.UPDATE:

                const sliced = shapes.slice();
                // sliced[i].data = data;
                setShapes(sliced);
                break;
        }

    }

    return [shapes, updateShape]
}

type UseShapesType = [
    MBE.Shape[],
    (action: MBE.ShapeAction, shape: MBE.Shape) => void
]