import * as PIXI from "pixi.js";
import {RootStore} from "../store/RootStore";
import {autorun} from "mobx";

export class RenderBackground extends PIXI.Graphics {
    constructor(private readonly store: RootStore) {
        super();
        this.interactive = true;
        this.on("click", (e) => {
            if (e.target === this) {
                store.selectedElement = null;
            }
        });
        autorun(() => {
            this.clear();
            this.beginFill(store.backgroundColor);
            this.drawRect(-10000, -10000, 20000, 20000);
            this.endFill();
        });
    }
}