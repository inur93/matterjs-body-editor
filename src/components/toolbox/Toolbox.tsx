import { Card, Fab } from "@material-ui/core";
import MoveIcon from '@material-ui/icons/OpenWith';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ImageUploadButton, ImageUploadModal } from "./ImageUpload";
import { ShapeColorPicker } from "./ShapeColorPicker";
import { EventType } from '../../events/CustomEvent';
import EventDispatcher from '../../events/EventDispatcher';
import { ShapeAddEnabledEvent } from "../../events/ShapeAddEnabledEvent";
import { ToggleDragEvent } from '../../events/ToggleDragEvent';
import { useDrag } from '../../hooks/useDrag';
import { Circle, Hand, Square } from '../../icons/Icons';
import { useKeyDownListener } from '../../hooks/useKeyDownListener';
import useKeyListener from "../../hooks/useKeyListener";

const settingsKey = 'toolboxSettings';
const readSettings = () => {
    const settingsStr = localStorage.getItem(settingsKey);

    return settingsStr ? JSON.parse(settingsStr) as ToolboxSettings : {
        x: 10,
        y: 10
    }
}

export const Toolbox = () => {
    const savedSettings: ToolboxSettings = readSettings();
    const [dragState, setAnchor, setMovingElement] = useDrag<HTMLDivElement, HTMLDivElement>(savedSettings);
    const [action, setAction] = useState<string>("");
    const anchorRef = useRef<HTMLDivElement | null>() as React.RefObject<HTMLDivElement>;
    const movingRef = useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;
    const [multiAdd] = useKeyDownListener('Control');
    useKeyListener('d', () => {
        updateAction(action === 'pan' ? '' : 'pan');
    })

    useEffect(() => {
        if (anchorRef.current) setAnchor(anchorRef.current);
        if (movingRef.current) setMovingElement(movingRef.current);
    }, [anchorRef, movingRef, setAnchor, setMovingElement]);



    const updateAction = useCallback((value: string) => {
        setAction(value);
        EventDispatcher.dispatch(new ToggleDragEvent(value === 'pan'));
        EventDispatcher.dispatch(new ShapeAddEnabledEvent(value && value !== 'pan' ? value as MBE.ShapeType : undefined));
    }, [setAction]);
    const handleActionSelect = (evt: React.MouseEvent<HTMLElement>, value: string) => updateAction(value);

    useEffect(() => {

        const _shapeAddListener = () => {
            if (!multiAdd) {
                setAction("");
                EventDispatcher.dispatch(new ShapeAddEnabledEvent(undefined));
            }
        };
        EventDispatcher.subscribe(EventType.SHAPE_ADD, _shapeAddListener);

        return () => {
            EventDispatcher.unsubscribe(EventType.SHAPE_ADD, _shapeAddListener);
        }
    }, [setAction, multiAdd]);



    return (<Card className="toolbox" ref={movingRef}>
        <Fab ref={anchorRef}
            className="toolbox-move-icon"
            color="primary"
            aria-label="move"
            component="div">
            <MoveIcon fontSize="inherit" />
        </Fab>
        <ToggleButtonGroup value={action}
            exclusive
            orientation="vertical"
            onChange={handleActionSelect}>
            <ToggleButton value="pan">
                <Hand />
            </ToggleButton>
            <ToggleButton value="rectangle">
                <Square />
            </ToggleButton>
            <ToggleButton value="circle">
                <Circle />
            </ToggleButton>
            <ImageUploadButton />
        </ToggleButtonGroup>
        {!dragState.isMoving && <ShapeColorPicker />}
        {!dragState.isMoving && <ImageUploadModal />}
    </Card>)
}
