
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        "root": {
            position: "relative",
            // position: absolute;
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
        }
    }),
);

export default function ToolboxButton(props: ToolboxButtonProps) {
    const classes = useStyles();

    return <div className={classes.root}>
        {props.toggle ? <ToggleButton {...props} /> : <Button {...props} />}
    </div >
}

type ToolboxButtonProps = {
    children: React.ReactElement,
    onClick: () => void,
    toggle?: boolean
}