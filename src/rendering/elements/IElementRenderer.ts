import * as PIXI from "pixi.js";
import { RootStore } from "../../store/RootStore";

export interface IElementRenderer extends PIXI.Container {
  startReactivity(store: RootStore): void;
  stopReactivity(): void;
}
