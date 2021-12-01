import * as PIXI from "pixi.js";
import {ResizeHandle} from "./ResizeHandle";
import {transformRectToLocal, transformRectToWorld} from "../util/transformRect";

export interface IRectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

export enum AlignHorizontal {
    "center" = "center",
    "left" = "left",
    "right" = "right",
}
export enum AlignVertical {
    "center" = "center",
    "top" = "top",
    "bottom" = "bottom",
}

export class Resizer2 extends PIXI.Container {

    private readonly graphics: PIXI.Graphics;
    private readonly handles: ResizeHandle[] = [];


    public snapToGrid: boolean = true;

    // BBox transformed into Resizer Space
    private targetBBox: IRectLike = new PIXI.Rectangle;

    // Original BBox in the Space of the Source
    private sourceBBox: IRectLike  = new PIXI.Rectangle;

    private sourceDisplayObject: PIXI.DisplayObject | undefined = undefined;

    public setGridSize(size: number) {
        this.handles.forEach(h => h.gridSize = size);
    }

    public setTarget(sourceBBox: IRectLike, sourceDisplayObject: PIXI.DisplayObject) {
        this.sourceDisplayObject = sourceDisplayObject;
        this.sourceBBox = sourceBBox;
        console.log("setTarget");
        this.calculateBBoxInResizerSpace();
        this.visible = true;
        this.redraw();
    }

    /*private targetToResizerSpace(p: PIXI.Point): PIXI.Point {
        const worldPoint = new PIXI.Point;
        this.targetDisplayObject!.transform.worldTransform.applyInverse(p, worldPoint);
        return this.transform.worldTransform.apply(worldPoint);
    }

    private resizerToTargetSpacce(p: PIXI.Point): PIXI.Point {
        const worldPoint = new PIXI.Point;
        this.transform.worldTransform.applyInverse(p, worldPoint);
        return this.targetDisplayObject!.worldTransform.apply(worldPoint);
    }*/

    private worldToResizerSpace(p: PIXI.Point): PIXI.Point {
        const localPoint = new PIXI.Point;
        this.worldTransform.applyInverse(p, localPoint);
        return localPoint;
    }

    constructor(
        private readonly onRectChanged: (newBounds: IRectLike) => void
    ) {
        super();
        this.interactive = true;
        this.graphics = new PIXI.Graphics()

        const bottomRight = new ResizeHandle("se-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.width - resizerSpaceDelta.x > 3) {
                    this.targetBBox.width = this.targetBBox.width - resizerSpaceDelta.x;
                }
                if (this.targetBBox.height - resizerSpaceDelta.y > 3) {
                    this.targetBBox.height = this.targetBBox.height - resizerSpaceDelta.y;
                }
                this.rectChanged();
            },
            () => this.targetBBox.x + this.targetBBox.width,
            () => this.targetBBox.y + this.targetBBox.height,
            () => true,
        );
        const topRight = new ResizeHandle("ne-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.width - resizerSpaceDelta.x > 3) {
                    this.targetBBox.width = this.targetBBox.width - resizerSpaceDelta.x;
                }
                if (this.targetBBox.height + resizerSpaceDelta.y > 3) {
                    this.targetBBox.y -= resizerSpaceDelta.y;
                    this.targetBBox.height += resizerSpaceDelta.y
                }
                this.rectChanged();
            },
            () => this.targetBBox.x + this.targetBBox.width,
            () => this.targetBBox.y,
            () => true,
        );
        const topLeft = new ResizeHandle("nw-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.width + resizerSpaceDelta.x > 3) {
                    this.targetBBox.x -= resizerSpaceDelta.x;
                    this.targetBBox.width += resizerSpaceDelta.x
                }
                if (this.targetBBox.height + resizerSpaceDelta.y > 3) {
                    this.targetBBox.y -= resizerSpaceDelta.y;
                    this.targetBBox.height += resizerSpaceDelta.y
                }
                this.rectChanged();
            },
            () => this.targetBBox.x,
            () => this.targetBBox.y,
            () => true,
        );
        const left = new ResizeHandle("w-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.width + resizerSpaceDelta.x > 3) {
                    this.targetBBox.x -= resizerSpaceDelta.x;
                    this.targetBBox.width += resizerSpaceDelta.x
                }
                this.rectChanged();
            },
            () => this.targetBBox.x,
            () => this.targetBBox.y + this.targetBBox.height / 2,
            () => this.targetBBox.height >= 20,
        );
        const top = new ResizeHandle("n-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.height + resizerSpaceDelta.y > 3) {
                    this.targetBBox.y -= resizerSpaceDelta.y;
                    this.targetBBox.height += resizerSpaceDelta.y
                }
                this.rectChanged();
            },
            () => this.targetBBox.x + this.targetBBox.width / 2,
            () => this.targetBBox.y,
            () => this.targetBBox.width >= 20,
        );
        const bottom = new ResizeHandle("s-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.height - resizerSpaceDelta.y > 3) {
                    this.targetBBox.height = this.targetBBox.height - resizerSpaceDelta.y;
                    // this.targetRect.width = this.targetRect.height * aspectRatio;
                }
                this.rectChanged();
            },
            () => this.targetBBox.x + this.targetBBox.width / 2,
            () => this.targetBBox.y + this.targetBBox.height,
            () => this.targetBBox.width >= 20,
        );
        const right = new ResizeHandle("e-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.width - resizerSpaceDelta.x > 3) {
                    this.targetBBox.width = this.targetBBox.width - resizerSpaceDelta.x;
                }
                this.rectChanged();
            },
            () => this.targetBBox.x + this.targetBBox.width,
            () => this.targetBBox.y + this.targetBBox.height / 2,
            () => this.targetBBox.height >= 20,
        );
        const leftBottom = new ResizeHandle("sw-resize",
            this.worldToResizerSpace.bind(this),
            (resizerSpaceDelta) => {
                if (this.targetBBox.height - resizerSpaceDelta.y > 3) {
                    this.targetBBox.height = this.targetBBox.height - resizerSpaceDelta.y;
                }
                if (this.targetBBox.width + resizerSpaceDelta.x > 3) {
                    this.targetBBox.x -= resizerSpaceDelta.x;
                    this.targetBBox.width += resizerSpaceDelta.x
                }
                this.rectChanged();
            },
            () => this.targetBBox.x,
            () => this.targetBBox.y + this.targetBBox.height,
            () => true,
        );

        this.visible = false;

        this.handles = [bottomRight, topRight, topLeft, top, bottom, leftBottom, right, left];
        this.addChild(this.graphics);
        this.handles.forEach(c => this.addChild(c))
    }

    private rectChanged() {

        const worldSpaceBBox = transformRectToWorld(this.targetBBox, this.transform);
        const targetSpaceBBox = transformRectToLocal(worldSpaceBBox, this.sourceDisplayObject!.parent.transform);
        this.sourceBBox = targetSpaceBBox;
        this.onRectChanged(targetSpaceBBox);
        this.redraw();
    }

    private calculateBBoxInResizerSpace() {
        this.sourceDisplayObject!.updateTransform();
        this.updateTransform();
        console.log("local", this.sourceBBox);
        const worldRect = transformRectToWorld(this.sourceBBox!, this.sourceDisplayObject!.parent.transform);
        console.log("world", worldRect, this.sourceDisplayObject!.toGlobal(this.sourceBBox!));
        this.targetBBox = transformRectToLocal(worldRect, this.transform);
        console.log("resizerLocal", this.targetBBox);
    }


    private redraw() {
        this.graphics.clear();
        this.handles.forEach(r => r.redraw());
        this.graphics.lineStyle(3, 0x999999);
        this.graphics.beginFill(0x999999,0);
        this.graphics.drawRect(this.targetBBox.x,this.targetBBox.y,this.targetBBox.width,this.targetBBox.height);
        this.graphics.endFill();
        this.handles.forEach(handle => handle.reposition());
    }

}

