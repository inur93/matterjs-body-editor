import { useEffect, useState } from "react"
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";
import { loadLsNumber, loadLsJson } from '../helperFunctions';
import { CanvasZoomEvent } from '../events/CanvasZoomEvent';
import { Vector2d } from "konva/types/types";
import { CanvasOffsetEvent } from "../events/CanvasOffsetEvent";


export const useScale = (): UseScaleType => {
    const [scale, setScale] = useState(loadLsNumber('scale') || 1);

    useEffect(() => {
        return EventDispatcher.subscribe(EventType.CANVAS_ZOOM,
            (evt: CanvasZoomEvent) => setScale(evt.scale));
    });
    const updateScale = (diff: number) => {
        const newVal = diff / 2000 + scale;
        if (newVal < 0.5) return;

        localStorage.setItem('scale', `${newVal}`);
        EventDispatcher.dispatch(new CanvasZoomEvent(newVal));

    }
    return [{
        x: scale,
        y: scale
    }, updateScale];
}

export const useViewport = (): UseViewportType => {
    const [scale, setScale] = useState(loadLsNumber('scale') || 1);
    const [offset, setOffset] = useState(loadLsJson<Vector2d>('viewport-offset') || { x: 0, y: 0 });

    useEffect(() => {
        const disposers = [
            EventDispatcher.subscribe(EventType.CANVAS_ZOOM,
                (evt: CanvasZoomEvent) => setScale(evt.scale)),
            EventDispatcher.subscribe(EventType.CANVAS_OFFSET,
                (evt: CanvasOffsetEvent) => setOffset(evt.offset))
        ]
        return () => disposers.forEach(x => x());
    });
    const updateScale = (diff: number) => {
        const newVal = diff / 2000 + scale;
        if (newVal < 0.5) return;

        localStorage.setItem('scale', `${newVal}`);
        EventDispatcher.dispatch(new CanvasZoomEvent(newVal));
    }

    const updateOffset = (val: Vector2d) => {
        localStorage.setItem('viewport-offset', JSON.stringify(val));
        EventDispatcher.dispatch(new CanvasOffsetEvent(val));
    }


    return [{
        scale: {
            x: scale,
            y: scale
        }, offset
    }, {
        updateScale,
        updateOffset
    }];
}

type UseScaleType = [
    Vector2d,
    (diff: number) => void,
]

type UseViewportType = [
    {
        scale: Vector2d,
        offset: Vector2d
    },
    {
        updateScale: (diff: number) => void,
        updateOffset: (offset: Vector2d) => void
    }
]