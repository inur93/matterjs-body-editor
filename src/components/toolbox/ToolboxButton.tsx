
import { Button } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React from 'react';

export const ToolboxButton = (props: ToolboxButtonProps) => {
    const p = {
        className: "toolbox-button",
        component: "span",
        onClick: props.onClick,
        children: props.children
    }
    return <div className="toolbox-button-wrapper">
        {props.toggle ? <ToggleButton {...props} /> : <Button {...props} />}
    </div >
}

type ToolboxButtonProps = {
    children: React.ReactElement,
    onClick: () => void,
    toggle?: boolean
}