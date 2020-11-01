import { ColorChangeEvent } from "../events/ColorChangeEvent";
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";
import { useEventSubscriber } from './useEventSubscriber';
import { useLocalStorage } from './useLocalStorage';


export const useShapeColor = (): UseShapeColorType => {
    const [color, setShapeColor] = useLocalStorage('color', '#00000');

    useEventSubscriber(EventType.COLOR_CHANGE, (evt: ColorChangeEvent) => setShapeColor(evt.color));

    const broadcastColor = (col: string) => {
        EventDispatcher.dispatch(new ColorChangeEvent(col));
    }
    return [color, broadcastColor];
}

type UseShapeColorType = [
    string,
    (col: string) => void
]