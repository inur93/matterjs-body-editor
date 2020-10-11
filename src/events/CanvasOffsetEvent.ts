

import { CustomEvent, EventType } from "./CustomEvent";
import { Vector2d } from 'konva/types/types';


export class CanvasOffsetEvent extends CustomEvent {

    public static type = EventType.CANVAS_OFFSET;
    offset: Vector2d;

    constructor(offset: Vector2d) {
        super(CanvasOffsetEvent.type);
        this.offset = offset;
    }
}
