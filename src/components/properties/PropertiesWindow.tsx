

import React, { useCallback } from 'react';
import { Card, CardHeader, Checkbox, createStyles, FormControlLabel, FormGroup, makeStyles, TextField, Theme } from '@material-ui/core';
import clsx from 'clsx';
import { ShapeAction, useShapes } from '../../hooks/useShapes';
import FloatingContainer from '../FloatingContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Vector2d } from 'konva/types/types';
import EventDispatcher from '../../events/EventDispatcher';
import { ShapesChangedEvent } from '../../events/ShapesChangedEvent';


const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
        // width: '300px',
        margin: '0.25rem',
        padding: '0.35rem'
    },
    'textfield': {
        marginBottom: '0.5rem'
    },
    hidden: {
        display: 'none'
    }
}));

type PropertiesWindowProps = {}

const propertyFields: MBE.PropertyField[] = [
    { label: 'Label', type: 'string', name: 'label', defaultValue: '' },
    { label: 'Is Platform', type: 'boolean', name: 'isPlatform', defaultValue: false },
    { label: 'Is Static', type: 'boolean', name: 'isStatic', defaultValue: true },
    { label: 'Is Sensor', type: 'boolean', name: 'isSensor', defaultValue: false },
    { label: 'Is Sleeping', type: 'boolean', name: 'isSleeping', defaultValue: false },
    // { label: 'Inertia', type: 'number', name: 'inertia', defaultValue: '' },
    { label: 'Friction', type: 'number', name: 'friction', defaultValue: 0 },
    { label: 'Air Friction', type: 'number', name: 'frictionAir', defaultValue: 0 },
    { label: 'Static Friction', type: 'number', name: 'frictionStatic', defaultValue: 0 }
]

type FieldProps = {
    field: MBE.PropertyField,
    className: string,
    value: MBE.PropertyFieldValue
}
function Field({ field, className, value }: FieldProps) {

    if (field.type === 'string' || field.type === 'number') {
        return <TextField
            className={className}
            type={field.type}
            defaultValue={value || field.defaultValue}
            name={field.name}
            variant='outlined'
            label={field.label}
            size='small'
            fullWidth
            InputLabelProps={{ shrink: true }} />
    }
    if (field.type === 'boolean') {
        const defaultValue = (value === undefined ? field.defaultValue : value) as boolean;
        return <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        name={field.name}
                        defaultChecked={defaultValue}
                        color='primary'
                    />
                }
                label={field.label}
            />
        </FormGroup>
    }
    return null;
}
export default function PropertiesWindow({ }: PropertiesWindowProps) {
    const classes = useStyles();
    const [shapes, selected, updateShape] = useShapes();
    if (!selected || !selected.length) return null;

    const shape = shapes.find(x => x.id === selected[0]);
    if (!shape) return null;

    const onChange = (e: React.FormEvent<HTMLFormElement>) => {
        const target = e.target as HTMLInputElement;
        const field = target.name as MBE.AnyField;
        if (!shape.properties) shape.properties = {};

        console.log('field changed', field);
        if (target.type === 'number') {
            shape.properties[field as MBE.NumberFields] = target.valueAsNumber;
        }
        if (target.type === 'text') {
            shape.properties[field as MBE.StringFields] = target.value;
        }
        if (target.type === 'checkbox') {
            shape.properties[field as MBE.BooleanFields] = target.checked;
        }
        updateShape(ShapeAction.UPDATE, shape);
    }
    return (<Card className={classes.root}>
        <CardHeader title='Properties' />
        <form onChange={onChange}>
            {
                propertyFields.map(x => <Field
                    key={`${shape.id}-${x.name}`}
                    className={classes.textfield}
                    field={x}
                    value={(shape.properties || {})[x.name]} />
                )
            }
        </form>
    </Card>);
}

export function FloatingPropertiesWindow() {
    const classes = useStyles();
    const [position, updatePosition] = useLocalStorage<Vector2d>('properties-window-position', { x: 10, y: 10 });
    const onMove = useCallback((position: Vector2d) => updatePosition(position), [updatePosition]);
    const [, selected] = useShapes();
    // if (!selected || !selected.length) return null;

    return <FloatingContainer
        className={clsx([(!selected || !selected.length) && classes.hidden])}
        key="properties-window"
        width={300}
        position={position}
        onMove={onMove}>
        <PropertiesWindow />
    </FloatingContainer>
}