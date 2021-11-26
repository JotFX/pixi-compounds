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
        props.store.createElement(new ImageElement());
    };
    const onExport = () => {
        <button onClick={props.onExport}>Export</button>
    };


    return <React.Fragment>

        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                </Typography>
                <Button color="inherit" onClick={onExport}>Export</Button>
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
                </Menu>

            </Toolbar>
        </AppBar>
        <Paper style={{padding: 20}}>
            {props.store.selectedElement?.getPropertyEditor(props.store) || <CanvasProperties store={props.store} /> }
        </Paper>
    </React.Fragment>
})