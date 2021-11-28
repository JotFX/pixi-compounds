import {observer} from "mobx-react";
import {RootStore} from "../store/RootStore";

import * as React from "react";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import {ElementType, IElement} from "../store/elements/IElement";
import ImageIcon from '@mui/icons-material/Image';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {ListItemButton} from "@mui/material";
import AbcIcon from '@mui/icons-material/Abc';
import CategoryIcon from '@mui/icons-material/Category';

import ListItemAvatar from "@mui/material/ListItemAvatar";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteIcon from '@mui/icons-material/Delete';

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

    const onDrop = ({removedIndex, addedIndex}: any) => {
        console.log(removedIndex, addedIndex);
        // setItems(items => arrayMove(items, removedIndex, addedIndex));
    };

    let startElement: IElement;

    const onDragStart = (e: React.DragEvent<HTMLLIElement>, f: IElement) => {
        startElement = f;
        e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }

    const onDragOver = (e: React.DragEvent<HTMLLIElement>, f: IElement) => {
        props.store.swapElements(startElement, f);
    }

    const onDragEnter = (e: React.DragEvent<HTMLLIElement>) => {
        e.dataTransfer.dropEffect = "copy";
    }
    const onDelete = (f: IElement) => {
        props.store.removeElement(f);
    }

    return <List sx={{width: "100%", bgcolor: "background.paper"}}>
        {props.store.templateElements.map((f) => (
            <ListItem key={f.id} draggable={true}
                      style={{cursor: "grab"}}
                      onDragStart={e => onDragStart(e, f)}
                      onDragOver={e => onDragOver(e,f)}
                      onDragEnter={e => onDragEnter(e)}
                      onClick={() => props.store.setSelectedElement(f)}
                      selected={props.store.selectedElement === f}>
                <ListItemAvatar>
                    <Avatar>
                        {getIcon(f)}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={f.title} secondary={JSON.stringify(f.bbox)}/>
                <ListItemSecondaryAction>
                    <ListItemIcon style={{cursor: "pointer"}}>
                        <DeleteIcon onClick={() => onDelete(f)} />
                    </ListItemIcon>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
});