import * as PIXI from "pixi.js";
import {RootStore} from "../store/RootStore";
import {autorun} from "mobx";

export class CenterCross extends PIXI.Graphics {
    constructor(store: RootStore) {
        super();
        const size = 10;
        this.lineStyle(1, 0xff0000);
        this.beginFill(0xff0000);
        this.moveTo(-size, 0);
        this.lineTo(size, 0);
        this.moveTo(0, size);
        this.lineTo(0, -size);
        this.endFill();
        autorun(() => {
            this.visible = store.showCenter;
            this.x = store.width / 2;
            this.y = store.height / 2;
        })
    }
}
