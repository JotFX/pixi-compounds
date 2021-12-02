import * as PIXI from "pixi.js";
import {CenterCross} from "./CenterCross";
import {RootStore} from "../store/RootStore";
import {watchArray} from "../util/watchArray";
import {ElementType, IElement} from "../store/elements/IElement";
import {IElementRenderer, IRendererContainer} from "./elements/IElementRenderer";
import {ImageElementRenderer} from "./elements/ImageElementRenderer";
import {ImageElement} from "../store/elements/ImageElement";
import {autorun, reaction} from "mobx";
import {ListElement} from "../store/elements/ListElement";

export class ElementRenderer extends PIXI.Container implements IRendererContainer{
    constructor(private readonly store: RootStore) {
        super();
        this.interactive = true;
        this.store.elementById.observe_(changes => {
            if (changes.type === "add") {
                const item = changes.newValue;

                let newRenderer = item.getRenderer();
                newRenderer.interactive = true;
                newRenderer.on("pointerdown", (e) => {
                    if (e.target === newRenderer) {
                        store.setSelectedElement(item);
                    }
                });
                newRenderer.startReactivity(this.store);

            } else if (changes.type === "delete") {
                const item = changes.oldValue;
                const renderer = item.getRenderer();
                renderer!.off("pointerdown");
                renderer?.stopReactivity();
            }
        });

        reaction(() => this.store.templateElementList.slice(0), (list) => {
            console.log("list", list);
            this.addChildrenTo(list, this);
        });

        this.sortableChildren = true;
    }

    removeChildRenderers(): void {
        this.removeChildren();
    }
    addChildRenderer(child: IElementRenderer): void {
        this.addChild(child);
    }

    private addChildrenTo(elements: ListElement[], targetContainer: IRendererContainer) {
        if (!elements) {
            return;
        }
        targetContainer.removeChildRenderers();
        elements.forEach((e, i) => {
            const renderer = e.element.getRenderer();
            renderer.zIndex = i;
            targetContainer.addChildRenderer(renderer);
            renderer.sortChildren();
            this.addChildrenTo(e.children, renderer);
        });
    }
}