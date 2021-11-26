import {observer} from "mobx-react";
import {RootStore} from "../../store/RootStore";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {ImageFile} from "../../store/ImageStore";
import {FormGroup} from "@mui/material";

export const ImageSelector = observer((props: {
    store: RootStore,
    onChange: (selectedImage: ImageFile | undefined) => void,
    value: string
}) => {
    return <FormGroup>
        <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
            <InputLabel id="imagePickerLabel">Image</InputLabel>
            <Select
                labelId="imagePickerLabel"
                id="imagePicker"
                value={props.value}
                onChange={(event) => props.onChange(props.store.imageStore.getImage(event.target.value))}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {props.store.imageStore.imageArray.map(f =>
                    <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                )}
            </Select>
        </FormControl>
    </FormGroup>
});