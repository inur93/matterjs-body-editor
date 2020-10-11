import { useImage } from "../hooks/useImage";
import React, { useEffect, useState } from 'react';
import { useScale, useViewport } from '../hooks/useScale';
import { Image as KonvaImage } from 'react-konva';
import { KonvaEventObject } from 'konva/types/Node';
import EventDispatcher from "../events/EventDispatcher";
import { EventType } from "../events/CustomEvent";
import { ToggleDragEvent } from '../events/ToggleDragEvent';

export const Backdrop = () => {
    const [imgData] = useImage();
    const [image, setImage] = useState<HTMLImageElement>();
    const [viewport, vpActions] = useViewport();
    const [dragEnabled, setDragEnabled] = useState(false);

    useEffect(() => {
        return EventDispatcher.subscribe(EventType.TOGGLE_DRAG, (evt: ToggleDragEvent) => setDragEnabled(evt.enabled));
    }, [])
    useEffect(() => {
        if (imgData) {
            const img = new Image(imgData.width, imgData.height);
            img.src = imgData?.src;
            img.addEventListener('load', () => setImage(img));
        }
    }, [imgData]);

    const onDrag = (evt: KonvaEventObject<DragEvent>) => {
        let x = evt.target.x();
        let y = evt.target.y();
        vpActions.updateOffset({ x, y });
    }

    if (!image) return null;

    return <KonvaImage draggable={dragEnabled}
        onDragEnd={onDrag}
        onDragMove={onDrag}
        x={viewport.offset.x}
        y={viewport.offset.y}

        scale={viewport.scale}
        image={image} />

    // return <img className="backdrop" style={{
    //     width: image.width * scale,
    //     height: image.height * scale
    // }} src={image.src} />
}