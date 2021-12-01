import {observer} from "mobx-react";
import {IElement} from "../../store/elements/IElement";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {FormGroup} from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {AlignHorizontal, AlignVertical} from "../../manipulators/Resizer2";

export const VerticalAlignEditor = observer((props: {model: IElement}) => {
    return <FormGroup>

        <ToggleButtonGroup title="Vertical Align"
        color="primary"
        value={props.model.bbox.verticalAlign}
        exclusive
        onChange={(e, value) => props.model.bbox.verticalAlign = value as AlignVertical}
    >
        <ToggleButton value={AlignVertical.top}>Top</ToggleButton>
        <ToggleButton value={AlignVertical.center}>Center</ToggleButton>
        <ToggleButton value={AlignVertical.bottom}>Bottom</ToggleButton>
    </ToggleButtonGroup>


    </FormGroup>
});