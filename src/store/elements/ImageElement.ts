import {makeAutoObservable} from "mobx";
import {ImageElementRenderer} from "../../rendering/elements/ImageElementRenderer";
import {createBBox, ElementType, IElement} from "./IElement";
import {clone} from "../../util/clone";
import {ImageElementEditor} from "../../view/elementEditors/ImageElementEditor";
import {RootStore} from "../RootStore";
import * as React from "react";
import {ListElement} from "./ListElement";

export class ImageElement implements IElement {
  static imageNumber: number = 1;
  id = Math.random().toFixed(36).substr(2);
  parent: IElement | null = null;
  bbox = createBBox();
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
    this.title = item.title;
    this.id = item.id;
    this.type = item.type;
  }

  writeItem(): object {
    return {
      bbox: this.bbox,
      imageId: this.imageId,
      title: this.title,
      id: this.id,
      type: this.type,
    };
  }
  getPropertyEditor(store: RootStore): JSX.Element {
    return React.createElement(ImageElementEditor, {model: this, store});
  }
}
