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
  parent: IElement | null = null;
  bbox = createBBox();
  title = "Text " + TextElement.imageNumber++;
  type = ElementType.Text;

  text: string = "New Text";
  textColor: number = 0xffffff;
  font: string = "Arial";
  fontSize: number = 24;

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
    this.textColor = item.textColor;
    this.font = item.font;
    this.fontSize = item.fontSize;
    this.title = item.title;
    this.id = item.id;
    this.type = item.type;
  }

  writeItem(): object {
    return {
      bbox: this.bbox,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
      fontSize: this.fontSize,
      title: this.title,
      id: this.id,
      type: this.type,
    };
  }
  getPropertyEditor(store: RootStore): JSX.Element {
    return React.createElement(TextElementEditor, {model: this, store});
  }
}
