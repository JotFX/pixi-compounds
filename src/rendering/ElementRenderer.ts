import * as PIXI from "pixi.js";
import {CenterCross} from "./CenterCross";
import {RootStore} from "../store/RootStore";
import {watchArray} from "../util/watchArray";
import {ElementType, IElement} from "../store/elements/IElement";
import {IElementRenderer} from "./elements/IElementRenderer";
import {ImageElementRenderer} from "./elements/ImageElementRenderer";
import {ImageElement} from "../store/elements/ImageElement";

export class ElementRenderer extends PIXI.Container {
    constructor(private readonly store: RootStore) {
        super();
        this.interactive = true;
        watchArray<IElement, IElementRenderer>(() => this.store.templateElements,
            (item, index) => {
                let newRenderer = item.getRenderer();
                this.addChild(newRenderer);
                newRenderer.interactive = true;
                newRenderer.on("pointerdown", () => {
                    store.setSelectedElement(item);
                });
                newRenderer.startReactivity(this.store);
                return newRenderer;
            },
            (item, view, index) => {
                view!.off("pointerdown");
                this.removeChild(view!);
                view?.stopReactivity();
            })
    }
}