import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {BBoxFit} from "../../store/elements/IElement";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import * as React from "react";
import {FormGroup} from "@mui/material";

export const SimpleDropdown = (props: {
    choices: { text: string; value: string }[],
    value: string,
    onChange: (newValue: string) => void,
}) => {
    return <FormGroup>
        <FormControl style={{textAlign: "left"}}>
            <InputLabel id="fitTypeLabel">Content Fit</InputLabel>
            <Select
                labelId="fitTypeLabel"
                variant="outlined"
                value={props.value}
                label="Age"
                onChange={e => props.onChange(e.target.value)}
            >
                {props.choices.map(c => <MenuItem key={c.value} value={c.value}>{c.text}</MenuItem>)}
            </Select>
        </FormControl>
    </FormGroup>
}