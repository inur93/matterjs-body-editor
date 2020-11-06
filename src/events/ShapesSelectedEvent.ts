import { CustomEvent, EventType } from "./CustomEvent";


export class ShapesSelectedEvent extends CustomEvent {

    public static type = EventType.SHAPES_SELECTED;
    shapes: string[];

    constructor(shapes: string[]) {
        super(ShapesSelectedEvent.type);
        this.shapes = shapes;
    }
}
