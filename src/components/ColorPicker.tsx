import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { ColorResult, CompactPicker } from 'react-color';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        "root": {}
    }),
);

type ColorPickerProps = {
    onChange?: (color: string) => void,
    onClose?: () => void,
    selected?: string,
    colors?: string[]
}

export default function ColorPicker({ onChange, onClose, selected, colors }: ColorPickerProps) {
    const classes = useStyles();
    const handleChange = (result: ColorResult) => onChange && onChange(result.hex);

    return <CompactPicker
        className={classes.root}
        colors={colors}
        color={selected}
        onChange={handleChange} />
}