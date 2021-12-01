import * as PIXI from "pixi.js";
import {RootStore} from "../store/RootStore";
import {Resizer2} from "./Resizer2";

export class ResizeHandle extends PIXI.Graphics {

    public gridSize: number = 10;

    constructor(
        cursor: string,
        worldToResizerSpace: (p: PIXI.Point) => PIXI.Point,
        applyDelta: (delta: PIXI.Point) => void,
        private xProvider: () => number,
        private yProvider: () => number,
        private fVisible: () => boolean,

    ) {
        super();
        this.interactive = true;
        this.cursor = cursor;
        let down = false;
        this.on("pointerdown", _ => down = true);
        this.on("pointermove", (interactionEvent: PIXI.InteractionEvent) => {
            if (down) {
                const current = worldToResizerSpace(interactionEvent.data.global.clone());
                //current.x = this.snapTo(current.x);
                //current.y = this.snapTo(current.y);
                const delta = new PIXI.Point(this.x - current.x, this.y - current.y);
                delta.x = this.snapTo(delta.x);
                delta.y = this.snapTo(delta.y);
                applyDelta(delta);
            }
        });
        this.on("pointerup", _ => down = false);
        this.on("pointerupoutside", _ => down = false);
        this.redraw();
    }

    snapTo(val: number): number {
        return Math.ceil(val / this.gridSize) * this.gridSize;
    }

    reposition() {
        this.x = this.xProvider();
        this.y = this.yProvider();
        this.visible = this.fVisible();
    }

    redraw() {
        this.beginFill(0x999999,1);
        this.lineStyle(0, 0x999999);
        const size = 5;
        this.drawRect(-size, -size, size * 2, size * 2);
        this.endFill();
    }
}