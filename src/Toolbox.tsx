import React, { useEffect } from 'react';
import { Button, Card } from "@material-ui/core"
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Circle, Square, Triangle, MousePointer, ImageUpload } from './icons/Icons';
import { JsxAttribute } from 'typescript';

const settingsKey = 'toolboxSettings';
const readSettings = () => {
    const settingsStr = localStorage.getItem(settingsKey);

    return settingsStr ? JSON.parse(settingsStr) as ToolboxSettings : {
        x: 0,
        y: 0
    }
}

export const Toolbox = ({ onImageChange }: ToolboxProps) => {
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

    const uploadImage = (data: any) => {
        debugger;
        onImageChange(data);
    }
    return (<Card className="toolbox" style={{
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
            <ToolboxUploadButton onFileChange={uploadImage}>
                <ImageUpload />
            </ToolboxUploadButton>
        </ToggleButtonGroup>
    </Card>)
}

const ToolboxButton = (props: ToolboxButtonProps) => {
    return <div className="toolbox-button-wrapper">
        <Button className="toolbox-button" component="span">
            {props.children}
        </Button>
    </div >
}

const ToolboxUploadButton = ({ children, onFileChange }: ToolboxUploadButtonProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const files = event?.target?.files;
        const file = files?.length ? files[0] : null;
        onFileChange(file && URL.createObjectURL(file));
    }
    return <label htmlFor="upload-image">
        <input style={{ display: 'none' }}
            id="upload-image"
            name="upload-image"
            type="file"
            onChange={handleChange} />
        <div className="toolbox-button-wrapper">
            <Button className="toolbox-button" component="span">
                {children}
            </Button>
        </div >
    </label>
}

type ToolboxButtonProps = {
    // onClick: () => void,
    children: JSX.Element
}

type ToolboxUploadButtonProps = {
    onFileChange: (file: string | null) => void,
    children: JSX.Element
}

type ToolboxProps = {
    onImageChange: (img: string | null) => void
}