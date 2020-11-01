
export enum EventType {
    SHAPE_ADD_ENABLED,
    SHAPES_CHANGED,
    SHAPE_SELECT,
    SHAPE_ADD,
    CANVAS_CLICK,
    CANVAS_ZOOM,
    CANVAS_OFFSET,
    COLOR_CHANGE,
    IMAGE_EVENT,
    SHOW_IMAGE_UPLOAD,
    TOGGLE_DRAG,
    LOCAL_STORAGE_KEY_CHANGED_EVENT
};
export abstract class CustomEvent {
    type: EventType;

    constructor(type: EventType) {
        this.type = type;
    }
}