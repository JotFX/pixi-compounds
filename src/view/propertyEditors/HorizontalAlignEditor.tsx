import {observer} from "mobx-react";
import {IElement} from "../../store/elements/IElement";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {FormGroup} from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {AlignHorizontal} from "../../manipulators/Resizer2";

export const HorizontalAlignEditor = observer((props: { model: IElement }) => {
    return <FormGroup>

        <ToggleButtonGroup
            title="Horizontal Align"
            color="primary"
            value={props.model.bbox.horizontalAlign}
            exclusive
            onChange={(e, value) => props.model.bbox.horizontalAlign = value as AlignHorizontal}
        >
            <ToggleButton value={AlignHorizontal.left}>Left</ToggleButton>
            <ToggleButton value={AlignHorizontal.center}>Center</ToggleButton>
            <ToggleButton value={AlignHorizontal.right}>Right</ToggleButton>
        </ToggleButtonGroup>


    </FormGroup>
});