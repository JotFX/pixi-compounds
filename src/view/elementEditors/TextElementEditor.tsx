import {observer} from "mobx-react";
import {ImageElement} from "../../store/elements/ImageElement";
import {RootStore} from "../../store/RootStore";
import {FormGroup, Paper} from "@mui/material";
import * as React from "react";
import {ImageSelector} from "../propertyEditors/ImageSelector";
import {ImageFile} from "../../store/ImageStore";
import {BBoxEditor} from "../propertyEditors/BBoxEditor";
import {TitleEditor} from "../propertyEditors/TitleEditor";
import {TextElement} from "../../store/elements/TextElement";
import TextField from "@mui/material/TextField";
import {HexColorPicker} from "react-colorful";
import {HEXToVBColor, VBColorToHEX} from "../../util/colorFunctions";

export const TextElementEditor = observer((props: {model: TextElement, store: RootStore}) => {

    return <React.Fragment>
        <TitleEditor model={props.model} />
        <BBoxEditor element={props.model} />
        <FormGroup>
            <TextField label="Text" variant="outlined"
                       multiline={true}
                   InputLabelProps={{shrink: true}}
                   onChange={e => props.model.text = e.target.value}
                   value={props.model.text}/>
        </FormGroup>
        <HexColorPicker style={{height: 150}}  color={VBColorToHEX(props.model.textColor)} onChange={col => props.model.textColor = HEXToVBColor(col)} />
    </React.Fragment>
});