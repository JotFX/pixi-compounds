import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { observer } from "mobx-react";
import {RootStore} from "../store/RootStore";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export const ImageList = observer((props: { store: RootStore }) => {

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", border: props.store.draggedFiles.length ? "1px solid green" : "" }}>
      {props.store.imageStore.imageArray.map((f) => (
        <ListItem key={f.name} secondaryAction={
          <IconButton edge="end" onClick={() => props.store.imageStore.deleteImage(f)} aria-label="delete">
            <DeleteIcon  />
          </IconButton>
        }>
          <ListItemAvatar>
            <Avatar>
              <div style={{background: "url(" + f.content + ")", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "contain", width: 32, height: 32}}> </div>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={f.name} secondary={"size"} />
        </ListItem>
      ))}
    </List>
  );
});
