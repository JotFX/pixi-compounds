import {IElementRenderer} from "../../rendering/elements/IElementRenderer";
import {ReactElement} from "react";
import {RootStore} from "../RootStore";

export enum BBoxFit {
    contain = "contain",
    containNoEnlarge = "containNoEnlarge",
    cover = "cover",
    noFit = "noFit",
}

export enum ElementType {
    Image = "Image",
}

export interface BBox {
    x: number;
    y: number;
    width: number;
    height: number;
    fit: BBoxFit;
}

export interface IElement {
    id: string;
    title: string;
    bbox: BBox;
    type: ElementType
    getRenderer(): IElementRenderer;
    readFromItem(item: any): void;
    writeItem(): any;
    getPropertyEditor(store: RootStore): JSX.Element;
}
