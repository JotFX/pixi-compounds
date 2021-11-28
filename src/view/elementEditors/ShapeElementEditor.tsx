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
import {ShapeElement, ShapeSurface, ShapeType} from "../../store/elements/ShapeElement";
import {SimpleDropdown} from "../propertyEditors/SimpleDropdown";
import {HexColorPicker} from "react-colorful";
import {HEXToVBColor, VBColorToHEX} from "../../util/colorFunctions";
import {ColorPicker} from "../propertyEditors/ColorPicker";

export const ShapeElementEditor = observer((props: {model: ShapeElement, store: RootStore}) => {

    return <React.Fragment>
        <TitleEditor model={props.model} />
        <BBoxEditor element={props.model} hideFitSelect={true} />

        <TextField id="outlined-number" label="Corner Radius" type="number" variant="standard"
                   InputLabelProps={{shrink: true}}
                   onChange={e => props.model.radius = parseInt(e.target.value)}
                   value={props.model.radius}/>
        <SimpleDropdown
            value={props.model.shape}
            onChange={val => props.model.shape = val as ShapeType}
            choices={[
                {text: "Rectangle", value: ShapeType.rect},
                {text: "Rounded Rectangle", value: ShapeType.rounded_rect},
                {text: "Circle", value: ShapeType.circle},
                {text: "Flat Hexagon", value: ShapeType.flat_hexagon},
                {text: "Hexagon", value: ShapeType.hexagon},
            ]} />
        <SimpleDropdown
            value={props.model.surface}
            onChange={val => props.model.surface = val as ShapeSurface}
            choices={[
                {text: "Color", value: ShapeSurface.color},
                {text: "Texture", value: ShapeSurface.texture},
            ]} />
        <ColorPicker title="Color" color={props.model.color} onChange={newColor => props.model.color = newColor} />

        <ImageSelector store={props.store} onChange={val => val && (props.model.textureId = val.name)} value={props.model.textureId} />
    </React.Fragment>
});