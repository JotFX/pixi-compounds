import {makeAutoObservable, observable} from "mobx";
import {BBoxFit, createBBox, ElementType, IElement} from "./IElement";
import {clone} from "../../util/clone";
import {RootStore} from "../RootStore";
import * as React from "react";
import {TextElementEditor} from "../../view/elementEditors/TextElementEditor";
import {TextElementRenderer} from "../../rendering/elements/TextElementRenderer";
import {AlignHorizontal, AlignVertical} from "../../manipulators/Resizer";
import {ShapeElementRenderer} from "../../rendering/elements/ShapeElementRenderer";
import {ShapeElementEditor} from "../../view/elementEditors/ShapeElementEditor";

export enum ShapeType {
  rect = "rect",
  circle = "circle",
  rounded_rect = "rounded_rect",
  hexagon = "hexagon",
  flat_hexagon = "flat_hexagon",
}

export enum ShapeSurface {
  texture = "texture",
  color = "color",
}

export class ShapeElement implements IElement {
  static shapeNumber = 1;
  id = Math.random().toFixed(36).substr(2);
  parent: IElement | null = null;
  bbox = createBBox();
  title = "Shape " + ShapeElement.shapeNumber++;
  type = ElementType.Shape;

  shape: ShapeType = ShapeType.rect;
  surface: ShapeSurface = ShapeSurface.color;
  color: number = 0x333333;
  textureId: string = "";
  textureScale: number = 1;
  radius: number = 10;

  private renderer = new ShapeElementRenderer(this);

  constructor() {
    makeAutoObservable(this);
  }

  getRenderer() {
    return this.renderer;
  }
  readFromItem(item: any) {
    this.bbox = clone(item.bbox);
    this.shape = item.shape;
    this.surface = item.surface;
    this.color = item.color;
    this.textureId = item.textureId;
    this.textureScale = item.textureScale;
    this.radius = item.radius;
    this.title = item.title;
    this.id = item.id;
    this.type = item.type;
  }

  writeItem(): object {
    return {
      bbox: this.bbox,
      shape: this.shape,
      surface: this.surface,
      color: this.color,
      textureId: this.textureId,
      textureScale: this.textureScale,
      radius: this.radius,
      title: this.title,
      id: this.id,
      type: this.type,
    };
  }
  getPropertyEditor(store: RootStore): JSX.Element {
    return React.createElement(ShapeElementEditor, {model: this, store});
  }
}
