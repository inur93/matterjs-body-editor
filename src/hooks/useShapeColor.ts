import { useEffect, useState } from "react";
import { ColorChangeEvent } from "../events/ColorChangeEvent";
import EventDispatcher from "../events/EventDispatcher";


export const useShapeColor = () : UseShapeColorType => {
    const [color, setShapeColor] = useState(localStorage.getItem('color') || '#00000');

    const colorChangeListener = (evt: ColorChangeEvent) => setShapeColor(evt.color);

    useEffect(() => {
        return EventDispatcher.subscribe(ColorChangeEvent.type, colorChangeListener)
    }, []);

    const broadcastColor = (col: string) => {
        EventDispatcher.dispatch(new ColorChangeEvent(col));
        localStorage.setItem('color', col);
    }
    return [color, broadcastColor];
}

type UseShapeColorType = [
    string,
    (col: string) => void
]