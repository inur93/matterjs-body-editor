import { useEffect } from "react";
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";



export const useEventSubscriber = (type: EventType, listener: (e: any) => void) => {
    
    useEffect(() => EventDispatcher.subscribe(type, listener), [type, listener]);
}