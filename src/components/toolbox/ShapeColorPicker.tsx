import React from 'react';
import { useShapeColor } from '../../hooks/useShapeColor';
import ColorPicker from '../ColorPicker';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        "root": {
            "& .compact-picker": {
                width: "60px !important"
            },
            "& .flexbox-fix": {
                display: 'none !important' // as other styles are hardcoded and can't be overwritten.
            }
        }
    }),
);

const colors = [
    '#4D4D4D', '#999999', '#FFFFFF', // black
    '#333333', '#808080', '#cccccc', // to
    '#000000', '#666666', '#B3B3B3', // white
    '#F44E3B', '#FE9200', '#FCDC00', // red
    '#D33115', '#E27300', '#FCC400', // to
    '#9F0500', '#C45100', '#FB9E00', // yellow
    '#B0BC00', '#68BC00', '#16A5A5', // green
    '#DBDF00', '#A4DD00', '#68CCCA', // to
    '#808900', '#194D33', '#0C797D', // turqoise
    '#73D8FF', '#AEA1FF', '#FDA1FF', // blue
    '#009CE0', '#7B64FF', '#FA28FF', // to
    '#0062B1', '#653294', '#AB149E'  // purple
]

export default function ShapeColorPicker() {
    const [color, setColor] = useShapeColor();
    const classes = useStyles();

    return (<div className={classes.root}>
        <ColorPicker onChange={setColor} selected={color} colors={colors} />
    </div>)
}