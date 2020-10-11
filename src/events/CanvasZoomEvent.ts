import { CustomEvent, EventType } from "./CustomEvent";


export class CanvasZoomEvent extends CustomEvent {

    public static type = EventType.CANVAS_ZOOM;
    scale: number;

    constructor(scale: number) {
        super(CanvasZoomEvent.type);
        this.scale = scale;
    }
}
