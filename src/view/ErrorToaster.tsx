import {observer} from "mobx-react";
import {RootStore} from "../store/RootStore";
import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';


export const ErrorToaster = observer((props: {store: RootStore}) => {

    const handleClose = () => {
        props.store.errors.clear();
    };

    const action = (
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
    );

    return (
            <Snackbar
                open={props.store.errors.length !== 0}
                autoHideDuration={6000}
                onClose={handleClose}
                message={props.store.errors.join(", ")}
                action={action}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error">{props.store.errors.join(", ")}</Alert>
            </Snackbar>
    );
})
