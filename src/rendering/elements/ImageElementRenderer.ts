import { IElementRenderer } from "./IElementRenderer";
import * as PIXI from "pixi.js";
import { ImageElement } from "../../store/elements/ImageElement";
import { RootStore } from "../../store/RootStore";
import {autorun, reaction} from "mobx";
import {Resizer} from "../../manipulators/Resizer";
import {emptyImage} from "../../store/ImageStore";


export class ImageElementRenderer extends PIXI.Sprite
  implements IElementRenderer {
  constructor(private readonly model: ImageElement) {
    super(PIXI.Texture.from(emptyImage));
  }
  startReactivity(store: RootStore) {
    autorun(() => {
      this.scale.set(1, 1);
      this.texture = PIXI.Texture.from(store.imageStore.getImageContent(this.model.imageId));
      Resizer.fitIntoRect(this.model.bbox, this, this.model.bbox.fit);
    })
  }

  stopReactivity() {}
}
