import { CustomEvent, EventType } from "./CustomEvent";


export class ShapeAddedEvent extends CustomEvent {

    public static type = EventType.SHAPE_ADD;
    shape: MBE.Shape;

    constructor(shape: MBE.Shape) {
        super(ShapeAddedEvent.type);
        this.shape = shape;
    }
}

