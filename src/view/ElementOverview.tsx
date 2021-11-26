import {observer} from "mobx-react";
import {RootStore} from "../store/RootStore";

import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import {ElementType, IElement} from "../store/elements/IElement";
import ImageIcon from '@mui/icons-material/Image';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {ListItemButton} from "@mui/material";
import AbcIcon from '@mui/icons-material/Abc';
import CategoryIcon from '@mui/icons-material/Category';

export const ElementOverview = observer((props: { store: RootStore }) => {

    const getIcon = (el: IElement) => {
        switch (el.type) {
            case ElementType.Image:
                return <ImageIcon/>
            case ElementType.Text:
                return <AbcIcon/>
            case ElementType.Shape:
                return <CategoryIcon/>
            default:
                return <QuestionMarkIcon/>
        }
    }


    return <List sx={{width: "100%", bgcolor: "background.paper"}}>
        {props.store.templateElements.map((f) => (
            <ListItemButton
                onClick={() => props.store.setSelectedElement(f)}
                selected={props.store.selectedElement === f}
                key={f.id}>
                <ListItemAvatar>
                    <Avatar>
                        {getIcon(f)}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={f.title} secondary={JSON.stringify(f.bbox)}/>
            </ListItemButton>
        ))}
    </List>
});