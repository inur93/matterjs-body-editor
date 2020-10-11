import { CustomEvent, EventType } from "./CustomEvent";


export class ColorChangeEvent extends CustomEvent {

    public static type = EventType.COLOR_CHANGE;
    color: string;

    constructor(color: string) {
        super(ColorChangeEvent.type);
        this.color = color;
    }
}
