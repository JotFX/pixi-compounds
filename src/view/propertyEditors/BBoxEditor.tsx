import {observer} from "mobx-react";
import {BBoxFit, IElement} from "../../store/elements/IElement";
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import {HorizontalAlignEditor} from "./HorizontalAlignEditor";
import {VerticalAlignEditor} from "./VerticalAlignEditor";


export const BBoxEditor = observer((props: {
    element: IElement,
    hideFitSelect?: boolean,
}) => {

    return <React.Fragment><FormGroup>

        <TextField id="outlined-number" label="X" type="number" variant="standard"
                   InputLabelProps={{shrink: true}}
                   onChange={e => props.element.bbox.x = parseInt(e.target.value)}
                   value={props.element.bbox.x}/>
        <TextField id="outlined-number" label="Y" type="number" variant="standard"
                   InputLabelProps={{shrink: true}}
                   onChange={e => props.element.bbox.y = parseInt(e.target.value)}
                   value={props.element.bbox.y}/>
        <TextField id="outlined-number" label="Width" type="number" variant="standard"
                   InputLabelProps={{shrink: true}}
                   onChange={e => props.element.bbox.width = parseInt(e.target.value)}
                   value={props.element.bbox.width}/>
        <TextField id="outlined-number" label="Height" type="number" variant="standard"
                   InputLabelProps={{shrink: true}}
                   onChange={e => props.element.bbox.height = parseInt(e.target.value)}
                   value={props.element.bbox.height}/>

    </FormGroup>
        <FormGroup style={{margin: 10, textAlign: "left"}}>
            <HorizontalAlignEditor model={props.element}/>
        </FormGroup>
        <FormGroup style={{margin: 10, textAlign: "left"}}>
            <VerticalAlignEditor model={props.element}/>
        </FormGroup>
        <FormGroup style={{margin: 10, textAlign: "left"}}>
        </FormGroup>
        {!props.hideFitSelect &&
        <FormGroup style={{margin: 10, textAlign: "left"}}>
            <FormControl>
                <InputLabel id="fitTypeLabel">Content Fit</InputLabel>
                <Select
                    labelId="fitTypeLabel"
                    variant="outlined"
                    value={props.element.bbox.fit}
                    label="Age"
                    onChange={e => props.element.bbox.fit = e.target.value as BBoxFit}
                >
                    <MenuItem value={BBoxFit.contain}>Contain</MenuItem>
                    <MenuItem value={BBoxFit.cover}>Cover</MenuItem>
                    <MenuItem value={BBoxFit.noFit}>Center</MenuItem>
                    <MenuItem value={BBoxFit.containNoEnlarge}>Contain, no enlarge</MenuItem>
                </Select>
            </FormControl>
        </FormGroup>}
    </React.Fragment>
});