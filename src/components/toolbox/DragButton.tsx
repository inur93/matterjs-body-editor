import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useState } from 'react';
import EventDispatcher from "../../events/EventDispatcher";
import { ToggleDragEvent } from '../../events/ToggleDragEvent';
import { Hand } from '../../icons/Icons';


export const DragButton = () => {
    const [value, setValue] = useState('');
    const onChange = (evt: React.MouseEvent<HTMLElement>, value: string) => {
        setValue(value);
        EventDispatcher.dispatch(new ToggleDragEvent(value === 'enabled'));
    }
    return <ToggleButtonGroup exclusive value={value} onChange={onChange}>
        <ToggleButton value={'enabled'}>
            <Hand />
        </ToggleButton>

    </ToggleButtonGroup>

}