import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import {HexColorPicker} from "react-colorful";
import {HEXToVBColor, VBColorToHEX} from "../../util/colorFunctions";
import * as React from "react";

export const ColorPicker = (props: {title: string, color: number, onChange: (newColor: number) => void}) => {
    return <FormControl>
        <Typography  component="p" style={{textAlign: "left"}}>
            {props.title}
        </Typography>
        <HexColorPicker title={props.title} style={{height: 100}}  color={VBColorToHEX(props.color)} onChange={col => props.onChange(HEXToVBColor(col))} />
    </FormControl>
}