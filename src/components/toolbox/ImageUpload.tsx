import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import React, { useState } from 'react';
import { EventType } from '../../events/CustomEvent';
import EventDispatcher from '../../events/EventDispatcher';
import { image2obj } from '../../helperFunctions';
import { useEventSubscriber } from '../../hooks/useEventSubscriber';
import { useImage } from '../../hooks/useImage';
import { ImageUpload } from "../../icons/Icons";
import ToolboxButton from './ToolboxButton';


export const ImageUploadButton = () => {
    const onClick = () => EventDispatcher.dispatchEmptyEvent(EventType.SHOW_IMAGE_UPLOAD);
    return <ToolboxButton onClick={onClick}>
        <ImageUpload />
    </ToolboxButton>

}

export const ImageUploadModal = () => {
    const [visible, setVisible] = useState(false);
    const [filename, setFilename] = useState('');
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [, setSelectedImage] = useImage();
    const [uploadedImage, setUploadedImage] = useState<MBE.Image>();
    useEventSubscriber(EventType.SHOW_IMAGE_UPLOAD, () => {
        setVisible(true);
    });

    const selectImage = () => {
        if (uploadedImage) {
            uploadedImage.width = width;
            uploadedImage.height = height;
            setSelectedImage(uploadedImage);
        }
        setVisible(false);
    }
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const files = event?.target?.files;
        const file = files?.length ? files[0] : null;
        if (file) {
            const image = await image2obj(file);
            setWidth(image.width);
            setHeight(image.height);
            setFilename(image.name);
            setUploadedImage(image);
        }
    }
    return <Dialog open={visible} onClose={() => setVisible(false)}>
        <DialogTitle id='upload-map-modal'>Upload map backdrop</DialogTitle>
        <DialogContent>
            <DialogContentText>{filename || 'no file selected'}</DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="width"
                label="Map width (px)"
                type="number"
                value={width}
                onChange={e => setWidth(Number.parseInt(e.target.value))}
                fullWidth />
            <TextField
                margin="dense"
                id="height"
                label="Map height (px)"
                type="number"
                value={height}
                onChange={e => setHeight(Number.parseInt(e.target.value))}
                fullWidth />
            <label htmlFor="upload-image">
                <input style={{ display: 'none' }}
                    id="upload-image"
                    name="upload-image"
                    type="file"
                    onChange={handleChange} />
                <Button variant="contained" color="primary" component="span">Upload</Button>{' '}
            </label>
            <Button variant="contained" color="primary" onClick={selectImage}>OK</Button>{' '}
            <Button color="primary">Cancel</Button>
        </DialogContent>

    </Dialog>
}