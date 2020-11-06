import React, { useEffect, useRef } from 'react';
import { Card, createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import MoveIcon from '@material-ui/icons/OpenWith';
import { useDrag } from '../hooks/useDrag';
import { Vector2d } from 'konva/types/types';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
        overflow: "visible",
        position: "absolute",
        // height: 650,
        // width: 65,
        "z-index": 1050
    },
    moveIcon: {
        width: 24,
        height: 24,
        "min-height": 24,
        position: "fixed",
        "margin-left": -12,
        "margin-top": - 12,
        "z-index": 1051,
        "font-size": "1.1em"
    }
}));

type FloatingContainerProps = {
    position: Vector2d,
    onMove: (position: Vector2d) => void,
    children?: React.ReactNode,
    width: number | string,
    className?: string
}
export default function FloatingContainer({ className, position, onMove, children, width }: FloatingContainerProps) {
    const classes = useStyles();
    const anchorRef = useRef<HTMLDivElement | null>() as React.RefObject<HTMLDivElement>;
    const movingRef = useRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;
    const [
        dragState,
        setAnchor,
        setMovingElement
    ] = useDrag<HTMLDivElement, HTMLDivElement>(position, onMove);

    useEffect(() => {
        if (anchorRef.current) setAnchor(anchorRef.current);
        if (movingRef.current) setMovingElement(movingRef.current);
    }, [anchorRef, movingRef, setAnchor, setMovingElement]);

    return (<div className={clsx(classes.root, className)} 
    style={{width}} 
    ref={movingRef}>
        <Fab ref={anchorRef}
            className={classes.moveIcon}
            color="primary"
            aria-label="move"
            component="div">
            <MoveIcon fontSize="inherit" />
        </Fab>
        {children}
    </div>);
}