import { KonvaEventObject } from 'konva/types/Node';
import { Vector2d } from "konva/types/types";
import { CanvasZoomEvent } from '../events/CanvasZoomEvent';
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";
import { useEventSubscriber } from './useEventSubscriber';
import { useLocalStorage } from './useLocalStorage';

export const useViewport = (): UseViewportType => {
    const [scale, setScale] = useLocalStorage('vp-scale', { x: 1, y: 1 });
    const [offset, setOffset] = useLocalStorage('vp-offset', { x: 0, y: 0 });

    useEventSubscriber(EventType.CANVAS_ZOOM, (evt: CanvasZoomEvent) => setScale({ x: evt.scale, y: evt.scale }));

    const updateScale = (diff: number) => {
        const newVal = diff / 2000 + scale.x;
        //TODO limit could be made as a ratio of screen size and map size.
        if (newVal < 0.5) return; // no reason scale further down

        EventDispatcher.dispatch(new CanvasZoomEvent(newVal));
    }

    const onPanEnd = (e: KonvaEventObject<DragEvent>) => {
        if (e.target === e.target.getStage()) {
            const offset = e.target.position();
            setOffset(offset);
        }
    }

    return [{
        scale,
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