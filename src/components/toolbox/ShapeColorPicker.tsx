import React from 'react';
import { useShapeColor } from '../../hooks/useShapeColor';
import { ColorPicker } from '../ColorPicker';


export const ShapeColorPicker = () => {
    const [color, setColor] = useShapeColor();

    return (<div style={{ position: 'fixed' }}>
    <ColorPicker onChange={setColor} selected={color} />
</div>)
}