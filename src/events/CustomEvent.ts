
export enum EventType {
    SHAPES_CHANGED,
    SHAPE_SELECT,
    SHAPE_ADD,
    CANVAS_CLICK,
    CANVAS_ZOOM,
    CANVAS_OFFSET,
    COLOR_CHANGE,
    IMAGE_EVENT,
    SHOW_IMAGE_UPLOAD,
    TOGGLE_DRAG
};
export abstract class CustomEvent {
    type: EventType;

    constructor(type: EventType) {
        this.type = type;
    }
}