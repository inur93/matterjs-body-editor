import { CustomEvent, EventType } from "./CustomEvent";


class EventDispatcher {

    _listeners: { [key: string]: MBE.EventListener[] } = {};


    subscribe(event: any, listener: MBE.EventListener) : MBE.DisposeListener {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(listener);
        return () => this.unsubscribe(event, listener);
    }

    dispatch(event: CustomEvent){
        const listeners = this._listeners[event.type];
        if(listeners){
            listeners.forEach(x => x(event))
        }
    }

    dispatchEmptyEvent(type: EventType){
        const listeners = this._listeners[type];
        if(listeners) listeners.forEach(x => x());
    }

    unsubscribe(event: any, listener: MBE.EventListener){
        const listeners = this._listeners[event];
        if(!listeners.filter(x => x === listener)){
            console.log('no matching listener found for', {event, listener});
        }
        if(listeners){
            this._listeners[event] = listeners.filter(x => x !== listener);
        }
    }

}

export default new EventDispatcher();