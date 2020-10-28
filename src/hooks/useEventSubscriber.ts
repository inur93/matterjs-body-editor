import { useEffect } from "react";
import { EventType } from "../events/CustomEvent";
import EventDispatcher from "../events/EventDispatcher";



export const useEventSubscriber = (type: EventType, listener: (e: any) => void, dependencies: React.DependencyList) => {

    useEffect(() => EventDispatcher.subscribe(type, listener), [type, listener]);
}