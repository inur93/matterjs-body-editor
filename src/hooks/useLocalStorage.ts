import { useState } from 'react';
import { EventType } from '../events/CustomEvent';
import EventDispatcher from '../events/EventDispatcher';
import { loadLsJson } from '../helperFunctions';
import { useEventSubscriber } from './useEventSubscriber';

type UseLocalStorageType<T> = [
    T,
    (data: T) => void
]

export function useLocalStorage<T>(key: string, defaultValue?: T): UseLocalStorageType<T> {
    const [data, setData] = useState(loadLsJson<T>(key, defaultValue));

    useEventSubscriber(EventType.LOCAL_STORAGE_KEY_CHANGED_EVENT, () => {
        setData(loadLsJson<T>(key, defaultValue));
    });

    const update = (d: T) => {
        localStorage.setItem(key, JSON.stringify(d));
        EventDispatcher.dispatchEmptyEvent(EventType.LOCAL_STORAGE_KEY_CHANGED_EVENT);
    }

    return [data, update];
}