import * as PIXI from "pixi.js";
import {RootStore} from "../store/RootStore";
import {ElementRenderer} from "./ElementRenderer";
import {IRectLike, Resizer2} from "../manipulators/Resizer2";
import {autorun, reaction, runInAction} from "mobx";
import {scaleIntoBox} from "../util/scaleIntoBox";
import {Mover} from "../manipulators/Mover";
import {CenterCross} from "./CenterCross";
import {RenderBackground} from "./RenderBackground";

export class Renderer {
    app: PIXI.Application;
    private readonly container: HTMLElement;
    private readonly elementRenderer: ElementRenderer;
    private readonly resizer: Resizer2;
    private readonly mover: Mover;

    private readonly viewContainer: PIXI.Container = new PIXI.Container;

    constructor(private readonly store: RootStore) {
        this.container = document.getElementById("renderContainer")!;
        this.app = new PIXI.Application();
        new ResizeObserver(this.onResize.bind(this)).observe(this.container);
        this.container?.appendChild(this.app.view);

        // Render BG
        this.app.stage.addChild(new RenderBackground(store));
        this.app.stage.addChild(this.viewContainer);
        // Elements
        this.elementRenderer = new ElementRenderer(store);
        this.viewContainer.addChild(this.elementRenderer);

        this.resizer = new Resizer2(this.onResizerChanged.bind(this));

        this.viewContainer.addChild(this.resizer);
        this.viewContainer.addChild(new CenterCross(store));

        this.app.ticker.add(() => this.onTicker());
        this.mover = new Mover(this.elementRenderer, store);

        reaction(() => this.store.selectedElement, (selectedElement) => {
            if (selectedElement) {
                this.mover.setTarget(selectedElement.getRenderer());
                this.resizer.setTarget(selectedElement.bbox, selectedElement.getRenderer());
            } else {
                this.resizer.visible = false;
            }
        });
        this.mover.onMoved.connect((view, delta) => {
            const target = this.store.selectedElement?.bbox!;
            runInAction(() => {
                target.x -= delta.x;
                target.y -= delta.y;
                this.resizer.setTarget(this.store.selectedElement!.bbox, this.store.selectedElement!.getRenderer());
            });
        });
        this.onResize();
        autorun(() => {
            this.elementRenderer.x = this.store.width / 2;
            this.elementRenderer.y = this.store.height / 2;
        });
    }

    private onResizerChanged(newBounds: IRectLike) {
        const target = this.store.selectedElement?.bbox;
        if (target) {
            runInAction(() => {
                target.x = newBounds.x;
                target.y = newBounds.y;
                target.width = newBounds.width;
                target.height = newBounds.height;
            });
        }
    }

    private onResize() {
        const size = this.container.getBoundingClientRect();
        this.app.renderer.resize(size.width, size.height);
        this.store.width = size.width;
        this.store.height = size.height;
    }

    private onTicker() {
    }
}
