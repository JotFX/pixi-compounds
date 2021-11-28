import {observer} from "mobx-react";
import {RootStore} from "../store/RootStore";
import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Paper} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {HexColorPicker} from "react-colorful";
import {HEXToVBColor, VBColorToHEX} from "../util/colorFunctions";
import Typography from "@mui/material/Typography";
import {ColorPicker} from "./propertyEditors/ColorPicker";

export const CanvasProperties = observer((props: {store: RootStore}) => {
    return <FormGroup>
            <FormControlLabel control={
                <Checkbox checked={props.store.showCenter} onChange={e => props.store.showCenter = e.target.checked} />
            } label="Show Center" />

            <FormControl style={{textAlign: "left"}}>
                <InputLabel id="labelGridSize">Snap to Grid Size</InputLabel>
                <Select

                    labelId="labelGridSize"
                    id="gridSizeSelect"
                    variant="outlined"
                    value={props.store.gridSize}
                    label="Age"
                    onChange={e => props.store.gridSize = e.target.value as number}
                >
                    <MenuItem value={1}>No Snap</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </FormControl>

        <ColorPicker color={props.store.backgroundColor} onChange={newColor => props.store.backgroundColor = newColor} title="Background Color" />
        </FormGroup>
});