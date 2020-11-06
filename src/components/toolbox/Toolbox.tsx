import { Card, createStyles, makeStyles, Theme } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Vector2d } from "konva/types/types";
import React, { useCallback, useState } from 'react';
import { EventType } from '../../events/CustomEvent';
import EventDispatcher from '../../events/EventDispatcher';
import { ShapeAddEnabledEvent } from "../../events/ShapeAddEnabledEvent";
import { ToggleDragEvent } from '../../events/ToggleDragEvent';
import { useEventSubscriber } from '../../hooks/useEventSubscriber';
import { useKeyDownListener } from '../../hooks/useKeyDownListener';
import useKeyListener from "../../hooks/useKeyListener";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Circle, Hand, Square } from '../../icons/Icons';
import FloatingContainer from "../FloatingContainer";
import { ImageUploadButton, ImageUploadModal } from "./ImageUpload";
import ShapeColorPicker from "./ShapeColorPicker";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        "root": {

        }
    }),
);

export function FloatingToolbox() {
    const [settings, updateSettings] = useLocalStorage<ToolboxSettings>('toolboxSettings');
    const onMove = useCallback((position: Vector2d) => updateSettings({ position }), [updateSettings]);

    return (<FloatingContainer
        key="floating-toolbox"
        width={65}
        position={settings.position}
        onMove={onMove}>
        <Toolbox />
    </FloatingContainer>)
}

export default function Toolbox() {
    const [action, setAction] = useState<string>("");
    const [multiAdd] = useKeyDownListener('Control');

    useKeyListener('d', () => updateAction(action === 'pan' ? '' : 'pan'));
    useEventSubscriber(EventType.SHAPE_ADD, function MultiAddListener() {
        if (!multiAdd) {
            setAction("");
            EventDispatcher.dispatch(new ShapeAddEnabledEvent(undefined));
        }
    })

    const updateAction = useCallback(function updateAction(value: string) {
        setAction(value);
        EventDispatcher.dispatch(new ToggleDragEvent(value === 'pan'));
        EventDispatcher.dispatch(new ShapeAddEnabledEvent(value && value !== 'pan' ? value as MBE.ShapeType : undefined));
    }, [setAction]);
    const handleActionSelect = (evt: React.MouseEvent<HTMLElement>, value: string) => updateAction(value);

    return (<React.Fragment>
        <Card>
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
            <ShapeColorPicker />
            <ImageUploadModal />
        </Card>
    </React.Fragment>)
}
