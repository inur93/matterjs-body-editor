import { useEffect } from 'react';
import EventDispatcher from '../events/EventDispatcher';
import { ImageEvent } from '../events/ImageEvent';
import { useLocalStorage } from './useLocalStorage';


export const useImage = (): UseImageType => {
    const [image, setImage] = useLocalStorage<MBE.Image>('image');

    useEffect(() => {
        return EventDispatcher.subscribe(ImageEvent.type, (evt: ImageEvent) => setImage(evt.img));
    }, [setImage]);

    const broadCastImage = (newImage: MBE.Image) => {
        EventDispatcher.dispatch(new ImageEvent(newImage));
    }


    return [image, broadCastImage]
}

type UseImageType = [
    (MBE.Image | undefined),
    (image: MBE.Image) => void
]