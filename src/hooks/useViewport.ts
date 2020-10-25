import { Vector2d } from "konva/types/types";
import { useEffect, useState } from "react";
import { CanvasZoomEvent } from '../events/CanvasZoomEvent';
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";
import { loadLsNumber, loadLsJson } from '../helperFunctions';
import { KonvaEventObject } from 'konva/types/Node';

export const useViewport = (): UseViewportType => {
    const [scale, setScale] = useState(loadLsNumber('vp-scale') || 1);
    const [offset, setOffset] = useState(loadLsJson<Vector2d>('vp-offset') || { x: 0, y: 0 });

    useEffect(() => {
        const disposers = [
            EventDispatcher.subscribe(EventType.CANVAS_ZOOM, (evt: CanvasZoomEvent) => setScale(evt.scale))
        ]
        return () => disposers.forEach(x => x());
    });
    const updateScale = (diff: number) => {
        const newVal = diff / 2000 + scale;
        if (newVal < 0.5) return;

        localStorage.setItem('vp-scale', `${newVal}`);
        EventDispatcher.dispatch(new CanvasZoomEvent(newVal));
    }

    const onPanEnd = (e: KonvaEventObject<DragEvent>) => {
        if (e.target === e.target.getStage()) {
            const offset = e.target.position();
            console.log('offset', offset);
            // localStorage.setItem('vp-offset', JSON.stringify(offset));
            setOffset(offset);
        }
    }

    return [{
        scale: {
            x: scale,
            y: scale
        },
        offset
    }, {
        updateScale,
        onPanEnd
    }];
}

type UseViewportType = [
    {
        scale: Vector2d,
        offset: Vector2d
    },
    {
        updateScale: (diff: number) => void,
        onPanEnd: (e: KonvaEventObject<DragEvent>) => void
    }
]