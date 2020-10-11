import { CustomEvent, EventType } from "./CustomEvent";


export class ShapesChangedEvent extends CustomEvent {

    public static type = EventType.SHAPES_CHANGED;
    shapes: MBE.Shape[];

    constructor(shapes: MBE.Shape[]) {
        super(ShapesChangedEvent.type);
        this.shapes = shapes;
    }
}
