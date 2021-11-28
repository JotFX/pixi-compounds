import {IElementRenderer} from "../../rendering/elements/IElementRenderer";
import {ReactElement} from "react";
import {RootStore} from "../RootStore";
import {AlignHorizontal, AlignVertical} from "../../manipulators/Resizer";
import {observable} from "mobx";

export enum BBoxFit {
    contain = "contain",
    containNoEnlarge = "containNoEnlarge",
    cover = "cover",
    noFit = "noFit",
}

export enum ElementType {
    Image = "Image",
    Text = "Text",
    Shape = "Shape",
}

export interface BBox {
    x: number;
    y: number;
    width: number;
    height: number;
    fit: BBoxFit;
    horizontalAlign: AlignHorizontal;
    verticalAlign: AlignVertical;
}

export const createBBox = () => {
    return observable({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fit: BBoxFit.contain,
        horizontalAlign: AlignHorizontal.center,
        verticalAlign: AlignVertical.center
    });
}

export interface IElement {
    id: string;
    parent: IElement | null;
    title: string;
    bbox: BBox;
    type: ElementType
    getRenderer(): IElementRenderer;
    readFromItem(item: any): void;
    writeItem(): any;
    getPropertyEditor(store: RootStore): JSX.Element;
}
