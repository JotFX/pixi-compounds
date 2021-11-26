import {makeAutoObservable, observable} from "mobx";
import {BBoxFit, createBBox, ElementType, IElement} from "./IElement";
import {clone} from "../../util/clone";
import {RootStore} from "../RootStore";
import * as React from "react";
import {TextElementEditor} from "../../view/elementEditors/TextElementEditor";
import {TextElementRenderer} from "../../rendering/elements/TextElementRenderer";
import {AlignHorizontal, AlignVertical} from "../../manipulators/Resizer";

export class TextElement implements IElement {
  static imageNumber = 1;
  id = Math.random().toFixed(36).substr(2);
  bbox = createBBox();
  title = "Text " + TextElement.imageNumber++;
  type = ElementType.Text;

  text: string = "New Text";
  textColor: number = 0xffffff;
  font: string = "Arial";
  fontSize: number = 24;
  horizontalAlign: AlignHorizontal = AlignHorizontal.center;
  verticalAlign: AlignVertical = AlignVertical.center;

  private renderer = new TextElementRenderer(this);

  constructor() {
    makeAutoObservable(this);
  }

  getRenderer() {
    return this.renderer;
  }
  readFromItem(item: any) {
    this.bbox = clone(item.bbox);
    this.text = item.text;
  }

  writeItem(): object {
    return {
      bbox: this.bbox,
      text: this.text
    };
  }
  getPropertyEditor(store: RootStore): JSX.Element {
    return React.createElement(TextElementEditor, {model: this, store});
  }
}
