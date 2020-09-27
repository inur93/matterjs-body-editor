import React, { useEffect } from 'react';
import { Card } from "@material-ui/core"
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Circle, Square, Triangle, MousePointer } from './icons/Icons';

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
    const [shape, setShape] = useState("");

    useEffect(() => {
        localStorage.setItem(settingsKey, JSON.stringify({
            x, y
        }));
    }, [x, y])
    const move = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!drag) return;
        const evt = e;
        let newX = evt.pageX - offsetX - 10;
        let newY = evt.pageY - offsetY - 10;
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

    const handleShapeSelect = (evt: React.MouseEvent<HTMLElement>, value: 'square' | 'polygon' | 'circle') => {
        setShape(value);
    }
    return (<Card style={{
        position: 'absolute',
        height: 200,
        width: 50,
        top: y,
        left: x
    }}
        onMouseDown={begin}
        onMouseMove={move}
        onMouseLeave={end}
        onMouseUp={end}>
        <ToggleButtonGroup value={shape}
            exclusive
            orientation="vertical"
            onChange={handleShapeSelect}>
            <ToggleButton value="square">
                <Square />
            </ToggleButton>
            <ToggleButton value="polygon">
                <Triangle />
            </ToggleButton>
            <ToggleButton value="circle">
                <Circle />
            </ToggleButton>
            <ToggleButton value="select">
                <MousePointer />
            </ToggleButton>
        </ToggleButtonGroup>
    </Card>)
}