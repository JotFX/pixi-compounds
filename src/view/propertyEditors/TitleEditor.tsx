import {observer} from "mobx-react";
import {IElement} from "../../store/elements/IElement";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {FormGroup} from "@mui/material";

export const TitleEditor = observer((props: {model: IElement}) => {
    return <FormGroup>
        <TextField label="Title" variant="standard"
               InputLabelProps={{shrink: true}}
               onChange={e => props.model.title = e.target.value}
                                 value={props.model.title}/>
    </FormGroup>
});