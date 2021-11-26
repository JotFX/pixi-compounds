import {observer} from "mobx-react";
import {ImageElement} from "../../store/elements/ImageElement";
import {RootStore} from "../../store/RootStore";
import {Paper} from "@mui/material";
import * as React from "react";
import {ImageSelector} from "../propertyEditors/ImageSelector";
import {ImageFile} from "../../store/ImageStore";
import {BBoxEditor} from "../propertyEditors/BBoxEditor";
import {TitleEditor} from "../propertyEditors/TitleEditor";

export const ImageElementEditor = observer((props: {model: ImageElement, store: RootStore}) => {
    const onImageSelect = (img: ImageFile | undefined) => {
        if (img) {
            props.model.imageId = img.name;
        } else {
            props.model.imageId = "";
        }
    };
    return <React.Fragment>
        <TitleEditor model={props.model} />
        <BBoxEditor element={props.model} />
        <ImageSelector value={props.model.imageId} store={props.store} onChange={onImageSelect} />
    </React.Fragment>
});