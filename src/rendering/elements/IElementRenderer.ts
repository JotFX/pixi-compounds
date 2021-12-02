import * as PIXI from "pixi.js";
import { RootStore } from "../../store/RootStore";

export interface IElementRenderer extends IRendererContainer{
  startReactivity(store: RootStore): void;
  stopReactivity(): void;
}

export interface IRendererContainer extends PIXI.Container {
  removeChildRenderers(): void;
  addChildRenderer(child: IElementRenderer): void;
}