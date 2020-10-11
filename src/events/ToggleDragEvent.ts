import { CustomEvent, EventType } from "./CustomEvent";


export class ToggleDragEvent extends CustomEvent {

    public static type = EventType.TOGGLE_DRAG;
    enabled: boolean = false;

    constructor(enabled: boolean) {
        super(ToggleDragEvent.type);
        this.enabled = enabled;
    }
}
