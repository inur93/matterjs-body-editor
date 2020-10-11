import React from 'react';
import { ColorResult, CompactPicker } from 'react-color';

type ColorPickerProps = {
    onChange?: (color: string) => void,
    onClose?: () => void,
    selected?: string
}
export const ColorPicker = ({ onChange, onClose, selected }: ColorPickerProps) => {
    const handleChange = (result : ColorResult) => onChange && onChange(result.hex);
    return <CompactPicker color={selected} onChange={handleChange} />
}