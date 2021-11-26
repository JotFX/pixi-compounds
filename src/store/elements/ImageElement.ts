import { makeAutoObservable, observable } from "mobx";
import { ImageElementRenderer } from "../../rendering/elements/ImageElementRenderer";
import {BBoxFit, ElementType, IElement} from "./IElement";
import { clone } from "../../util/clone";
import {ImageElementEditor} from "../../view/elementEditors/ImageElementEditor";
import {RootStore} from "../RootStore";
import * as React from "react";

export class ImageElement implements IElement {
  static imageNumber: number = 1;
  id = Math.random().toFixed(36).substr(2);
  bbox = observable({ x: 0, y: 0, width: 100, height: 100, fit: BBoxFit.contain });
  imageId = "";
  title = "Image " + ImageElement.imageNumber++;
  type = ElementType.Image;
  private renderer = new ImageElementRenderer(this);

  constructor() {
    makeAutoObservable(this);
  }

  getRenderer() {
    return this.renderer;
  }
  readFromItem(item: any) {
    this.bbox = clone(item.bbox);
    this.imageId = item.imageId;
  }

  writeItem(): object {
    return {
      bbox: this.bbox,
      imageId: this.imageId
    };
  }
  getPropertyEditor(store: RootStore): JSX.Element {
    return React.createElement(ImageElementEditor, {model: this, store});
  }
}
