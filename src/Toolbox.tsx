import { Button, Card } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { ColorPicker } from "./components/ColorPicker";
import { EventType } from './events/CustomEvent';
import EventDispatcher from './events/EventDispatcher';
import { ShapeSelectedEvent } from './events/ShapeSelectedEvent';
import { image2obj } from "./helperFunctions";
import { Circle, ImageUpload, Square } from './icons/Icons';
import { ColorChangeEvent } from './events/ColorChangeEvent';
import { ImageUploadButton, ImageUploadModal } from "./components/toolbox/ImageUpload";
import { ShapeColorPicker } from "./components/toolbox/ShapeColorPicker";
import { DragButton } from "./components/toolbox/DragButton";

const settingsKey = 'toolboxSettings';
const readSettings = () => {
    const settingsStr = localStorage.getItem(settingsKey);

    return settingsStr ? JSON.parse(settingsStr) as ToolboxSettings : {
        x: 0,
        y: 0
    }
}

export const Toolbox = () => {
    const savedSettings: ToolboxSettings = readSettings();
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [x, setX] = useState(savedSettings.x);
    const [y, setY] = useState(savedSettings.y);
    const [drag, setDrag] = useState(false);
    const [shape, setShape] = useState<MBE.Shape | undefined>(undefined);



    useEffect(() => {
        EventDispatcher.dispatch(new ShapeSelectedEvent(shape));
    }, [shape])
    useEffect(() => {
        const listener = () => setShape(undefined);
        EventDispatcher.subscribe(EventType.SHAPE_ADD, listener);

        return () => EventDispatcher.unsubscribe(EventType.SHAPE_ADD, listener);
    }, []);
    useEffect(() => {
        localStorage.setItem(settingsKey, JSON.stringify({
            x, y
        }));
    }, [x, y])
    const move = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!drag) return;
        const evt = e;
        let newX = evt.pageX - offsetX;
        let newY = evt.pageY - offsetY;
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        setX(newX);
        setY(newY);
    };
    const begin = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        setOffsetX(e.clientX - el.getBoundingClientRect().left);
        setOffsetY(e.clientY - el.getBoundingClientRect().top);
        setDrag(true);
    }
    const end = () => {
        setDrag(false);
    }

    const handleShapeSelect = (evt: React.MouseEvent<HTMLElement>, value: MBE.Shape) => {
        setShape(value);
    }

    return (<Card className="toolbox" style={{
        top: y,
        left: x
    }}
        onMouseDown={begin}
        onMouseMove={move}
        onMouseLeave={end}
        onMouseUp={end}>

        <DragButton />
        <ToggleButtonGroup value={shape}
            exclusive
            orientation="vertical"
            onChange={handleShapeSelect}>
            <ToggleButton value="rectangle">
                <Square />
            </ToggleButton>
            <ToggleButton value="circle">
                <Circle />
            </ToggleButton>
            <ImageUploadButton />
        </ToggleButtonGroup>
        <ShapeColorPicker />
        <ImageUploadModal />
    </Card>)
}
