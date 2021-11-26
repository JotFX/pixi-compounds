import * as PIXI from "pixi.js";
import { RootStore } from "../store/RootStore";
import {ElementRenderer} from "./ElementRenderer";
import {Resizer} from "../manipulators/Resizer";
import {autorun, reaction, runInAction} from "mobx";
import {scaleIntoBox} from "../util/scaleIntoBox";
import {Mover} from "../manipulators/Mover";
import {CenterCross} from "./CenterCross";
import {RenderBackground} from "./RenderBackground";

export class Renderer {
  app: PIXI.Application;
  private readonly container: HTMLElement;
  private readonly elementRenderer: ElementRenderer;
  private readonly resizer: Resizer;
  private readonly mover: Mover;

  private readonly manipulatorsContainer: PIXI.Container;

  constructor(private readonly store: RootStore) {
    this.container = document.getElementById("renderContainer")!;
    this.app = new PIXI.Application();
    new ResizeObserver(this.onResize.bind(this)).observe(this.container);
    this.container?.appendChild(this.app.view);

    this.manipulatorsContainer = new PIXI.Container();

    this.elementRenderer = new ElementRenderer(store);
    this.app.stage.addChild(new RenderBackground(store));
    this.app.stage.addChild(this.elementRenderer);
    this.app.stage.addChild(this.manipulatorsContainer);
    this.app.ticker.add(() => this.onTicker());
    this.mover = new Mover(this.elementRenderer, store);
    this.resizer = new Resizer(global => this.elementRenderer.toLocal(global), store);
    reaction(() => this.store.selectedElement, (selectedElement) => {
      if (selectedElement) {
        this.mover.setTarget(selectedElement.getRenderer());
        this.resizer.setTarget(selectedElement.bbox);
      } else {
        this.resizer.visible = false;
      }
    });
    this.mover.onMoved.connect((view, delta) => {
      const target = this.store.selectedElement?.bbox!;
      runInAction(() => {
        target.x -= delta.x;
        target.y -= delta.y;
        this.resizer.setTarget(target);
      });
    });
    this.resizer.onRectChanged.connect(newBounds => {
      const target = this.store.selectedElement?.bbox;
      if (target) {
        runInAction(() => {
          target.x = newBounds.x;
          target.y = newBounds.y;
          target.width = newBounds.width;
          target.height = newBounds.height;
        });
      }
    });
    this.manipulatorsContainer.addChild(this.resizer);
    this.manipulatorsContainer.addChild(new CenterCross(store));
    this.onResize();
  }

  private onResize() {
    const size = this.container.getBoundingClientRect();
    this.app.renderer.resize(size.width, size.height);
    this.app.stage.x = size.width / 2;
    this.app.stage.y = size.height / 2;
  }

  private onTicker() {}
}
