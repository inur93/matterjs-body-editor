import { Card, createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import MoveIcon from '@material-ui/icons/OpenWith';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ImageUploadButton, ImageUploadModal } from "./ImageUpload";
import ShapeColorPicker from "./ShapeColorPicker";
import { EventType } from '../../events/CustomEvent';
import EventDispatcher from '../../events/EventDispatcher';
import { ShapeAddEnabledEvent } from "../../events/ShapeAddEnabledEvent";
import { ToggleDragEvent } from '../../events/ToggleDragEvent';
import { useDrag } from '../../hooks/useDrag';
import { Circle, Hand, Square } from '../../icons/Icons';
import { useKeyDownListener } from '../../hooks/useKeyDownListener';
import useKeyListener from "../../hooks/useKeyListener";
import { useEventSubscriber } from '../../hooks/useEventSubscriber';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        "root": {
            overflow: "visible",
            position: "absolute",
            // height: 650,
            width: 65,
            "z-index": 1050
        },
        "moveIcon": {
            width: 24,
            height: 24,
            "min-height": 24,
            position: "fixed",
            "margin-left": -12,
            "margin-top": - 12,
            "z-index": 1051,
            "font-size": "1.1em"
        }
    }),
);

export default function Toolbox() {
    const classes = useStyles();
    const [settings, updateSettings] = useLocalStorage<ToolboxSettings>('toolboxSettings');
    const [action, setAction] = useState<string>("");
    const anchorRef = useRef<HTMLDivElement | null>() as React.RefObject<HTMLDivElement>;
    const movingRef = useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;
    const [multiAdd] = useKeyDownListener('Control');
    const [
        dragState,
        setAnchor,
        setMovingElement
    ] = useDrag<HTMLDivElement, HTMLDivElement>(settings.position,
        (position) => updateSettings({ position }));

    useKeyListener('d', () => {
        updateAction(action === 'pan' ? '' : 'pan');
    })

    useEventSubscriber(EventType.SHAPE_ADD, () => {
        if (!multiAdd) {
            setAction("");
            EventDispatcher.dispatch(new ShapeAddEnabledEvent(undefined));
        }
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

    return (<Card className={classes.root} ref={movingRef}>
        <Fab ref={anchorRef}
            className={classes.moveIcon}
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
