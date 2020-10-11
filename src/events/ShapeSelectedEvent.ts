import { CustomEvent, EventType } from "./CustomEvent";


export class ShapeSelectedEvent extends CustomEvent{
   
    public static type = EventType.SHAPE_SELECT;
    shape?: MBE.Shape;
    selected: boolean = true;

    constructor(shape?: MBE.Shape, selected: boolean = true){
        super(ShapeSelectedEvent.type);
        this.shape = shape;
        this.selected = selected;
    }
}
