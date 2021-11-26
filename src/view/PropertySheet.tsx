import {observer} from "mobx-react";
import {RootStore} from "../store/RootStore";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {ImageElement} from "../store/elements/ImageElement";
import {IElement} from "../store/elements/IElement";
import {CanvasProperties} from "./CanvasProperties";
import {BBoxEditor} from "./propertyEditors/BBoxEditor";
import {Paper} from "@mui/material";
import {TextElement} from "../store/elements/TextElement";
import {ShapeElement} from "../store/elements/ShapeElement";

export const PropertySheet = observer((props: {store: RootStore; onExport: () => void; }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const openElementMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const createImage = () => {
        handleClose();
        props.store.addElement(new ImageElement());
    };
    const createText = () => {
        handleClose();
        props.store.addElement(new TextElement());
    };
    const createShape = () => {
        handleClose();
        props.store.addElement(new ShapeElement());
    };
    const onExport = () => {
        props.onExport();
    };


    return <React.Fragment>

        <AppBar position="static">
            <Toolbar>
                <div style={{textAlign: "left", flexGrow: 1}} >
                    <Button color="inherit" variant={"outlined"} onClick={onExport}>Export</Button>
                </div>
                <Button color="inherit" onClick={openElementMenu}>Create Element</Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={createImage}>Image</MenuItem>
                    <MenuItem onClick={createText}>Text</MenuItem>
                    <MenuItem onClick={createShape}>Shape</MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
        <Paper style={{padding: 20}}>
            {props.store.selectedElement?.getPropertyEditor(props.store) || <CanvasProperties store={props.store} /> }
        </Paper>
    </React.Fragment>
})