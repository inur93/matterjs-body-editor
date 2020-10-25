import { useEffect, useState } from 'react';
import EventDispatcher from '../events/EventDispatcher';
import { ImageEvent } from '../events/ImageEvent';
import { loadLsJson } from '../helperFunctions';


export const useImage = (): UseImageType => {
    const [image, setImage] = useState<MBE.Image | undefined>(loadLsJson<MBE.Image>('image'));

    useEffect(() => {
        return EventDispatcher.subscribe(ImageEvent.type, (evt: ImageEvent) => evt.img !== image && setImage(evt.img));
    }, [image])
    const broadCastImage = (newImage: MBE.Image) => {
        setImage(newImage);
        localStorage.setItem('image', JSON.stringify(newImage));
        EventDispatcher.dispatch(new ImageEvent(newImage));
    }


    return [image, broadCastImage]
}

type UseImageType = [
    (MBE.Image | undefined),
    (image: MBE.Image) => void
]