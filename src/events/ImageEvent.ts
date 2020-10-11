import { CustomEvent, EventType } from "./CustomEvent";


export class ImageEvent extends CustomEvent {

    public static type = EventType.IMAGE_EVENT;
    img: MBE.Image;

    constructor(img: MBE.Image) {
        super(ImageEvent.type);
        this.img = img;
    }
}
