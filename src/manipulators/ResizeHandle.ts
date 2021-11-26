import * as PIXI from "pixi.js";
import {IRectLike, Resizer} from "./Resizer";
import {RootStore} from "../store/RootStore";

export class ResizeHandle extends PIXI.Graphics {

    constructor(
        parent: PIXI.DisplayObject,
        private readonly store: RootStore,
        cursor: string,
        getLocalValue: (global: PIXI.Point) => PIXI.Point,
        fApplyDelta: (delta: PIXI.Point) => void,
        private fGetX: (targetBounds: IRectLike) => number,
        private fGetY: (targetBounds: IRectLike) => number,
        private fVisible: () => boolean,

    ) {
        super();
        this.interactive = true;
        if (cursor) {
            this.cursor = cursor;
        }
        let down = false;
        this.on("pointerdown", _ => down = true);
        this.on("pointermove", (interactionEvent: PIXI.InteractionEvent) => {
            if (down) {
                const current = getLocalValue(interactionEvent.data.global.clone()); // interactionEvent.data.getLocalPosition(parent).clone();
                current.x = this.snapTo(current.x);
                current.y = this.snapTo(current.y);
                const delta = new PIXI.Point(this.x - current.x, this.y - current.y);
                fApplyDelta(delta);
            }
        });
        this.on("pointerup", _ => down = false);
        this.on("pointerupoutside", _ => down = false);
        this.redraw();
    }

    snapTo(val: number): number {
        return Math.ceil(val / this.store.gridSize) * this.store.gridSize;
    }

    reposition(targetBounds: IRectLike) {
        if (!targetBounds) {
            console.error("no boudns");
        }
        this.x = this.fGetX(targetBounds);
        this.y = this.fGetY(targetBounds);
        this.visible = this.fVisible();
    }

    redraw() {
        this.beginFill(0x999999,1);
        this.lineStyle(0, 0x999999);
        const size = 5 / Resizer.getGlobalScale(this);
        this.drawRect(-size, -size, size * 2, size * 2);
        this.endFill();
    }
}