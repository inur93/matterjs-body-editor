import { CustomEvent, EventType } from "./CustomEvent";


export class ShapeAddEnabledEvent extends CustomEvent {

    public static type = EventType.SHAPE_ADD_ENABLED;
    shapeType?: MBE.ShapeType;

    constructor(shapeType?: MBE.ShapeType) {
        super(ShapeAddEnabledEvent.type);
        this.shapeType = shapeType;
    }
}
