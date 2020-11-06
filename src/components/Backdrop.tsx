import { KonvaEventObject } from 'konva/types/Node';
import React, { memo, useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useImage } from "../hooks/useImage";


function Backdrop({ onClick }: BackdropProps) {
    const [imgData] = useImage();
    const [image, setImage] = useState<HTMLImageElement>();

    useEffect(() => {
        if (imgData) {
            const img = new Image(imgData.width, imgData.height);
            img.src = imgData?.src;
            img.addEventListener('load', () => setImage(img));
        }
    }, [imgData]);

    if (!image) return null;

    return <KonvaImage name="backdrop" image={image} onClick={onClick} />
}

export default memo(Backdrop);

type BackdropProps = {
    onClick: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void
}