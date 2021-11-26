import * as PIXI from "pixi.js";
import {ResizeHandle} from "./ResizeHandle";
import {Signal} from "typed-signals";
import {BBoxFit} from "../store/elements/IElement";
import {scaleIntoBox} from "../util/scaleIntoBox";
import {RootStore} from "../store/RootStore";

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
export class Resizer extends PIXI.Container {

    private readonly graphics: PIXI.Graphics;
    private readonly handles: ResizeHandle[] = [];

    private targetRect: IRectLike = new PIXI.Rectangle();
    private aspectRatio: number = 1;

    public snapToGrid: boolean = true;

    public onRectChanged: Signal<(newBounds: IRectLike) => void> = new Signal()

    public setTarget(targetRect: IRectLike) {
        this.visible = true;
        Object.assign(this.targetRect, targetRect);
        this.aspectRatio = this.targetRect.width / this.targetRect.height;
        this.redraw();
    }

    public move(delta: PIXI.Point) {
        this.targetRect.x -= delta.x;
        this.targetRect.y -= delta.y;
        this.rectChanged();
    }

    public moveTo(delta: PIXI.Point) {
        this.targetRect.x -= delta.x;
        this.targetRect.y -= delta.y;
        this.rectChanged();
    }

    /**
     *
     * @param getLocalValue Funktion um Wert auf einem Grid einschnappen zu lassen. Muss von extern kommen,
     * da durch Skalierungen externe Kontexte wichtig sein.
     */
    constructor(
        getLocalValue: (global: PIXI.Point) => PIXI.Point,
        private readonly store: RootStore,
    ) {
        super();
        this.interactive = true;
        this.graphics = new PIXI.Graphics()

        const bottomRight = new ResizeHandle(this, this.store,
            "se-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.width - delta.x > 3) {
                    this.targetRect.width = this.targetRect.width - delta.x;
                }
                if (this.targetRect.height - delta.y > 3) {
                    this.targetRect.height = this.targetRect.height - delta.y;
                    // this.targetRect.width = this.targetRect.height * aspectRatio;
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x + targetBounds.width,
            (targetBounds) => targetBounds.y + targetBounds.height,
            () => true,
        );
        const topRight = new ResizeHandle(this, this.store,
            "ne-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.width - delta.x > 3) {
                    this.targetRect.width = this.targetRect.width - delta.x;
                }
                if (this.targetRect.height + delta.y > 3) {
                    this.targetRect.y -= delta.y;
                    this.targetRect.height += delta.y
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x + targetBounds.width,
            (targetBounds) => targetBounds.y,
            () => true,
        );
        const topLeft = new ResizeHandle(this, this.store, "nw-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.width + delta.x > 3) {
                    this.targetRect.x -= delta.x;
                    this.targetRect.width += delta.x
                }
                if (this.targetRect.height + delta.y > 3) {
                    this.targetRect.y -= delta.y;
                    this.targetRect.height += delta.y
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x,
            (targetBounds) => targetBounds.y,
            () => true,
        );
        const left = new ResizeHandle(this, this.store, "w-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.width + delta.x > 3) {
                    this.targetRect.x -= delta.x;
                    this.targetRect.width += delta.x
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x,
            (targetBounds) => targetBounds.y + targetBounds.height / 2,
            () => this.targetRect.height >= 20,
        );
        const top = new ResizeHandle(this, this.store, "n-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.height + delta.y > 3) {
                    this.targetRect.y -= delta.y;
                    this.targetRect.height += delta.y
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x + targetBounds.width / 2,
            (targetBounds) => targetBounds.y,
            () => this.targetRect.width >= 20,
        );
        const bottom = new ResizeHandle(this, this.store, "s-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.height - delta.y > 3) {
                    this.targetRect.height = this.targetRect.height - delta.y;
                    // this.targetRect.width = this.targetRect.height * aspectRatio;
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x + targetBounds.width / 2,
            (targetBounds) => targetBounds.y + targetBounds.height,
            () => this.targetRect.width >= 20,
        );
        const right = new ResizeHandle(this, this.store, "e-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.width - delta.x > 3) {
                    this.targetRect.width = this.targetRect.width - delta.x;
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x + targetBounds.width,
            (targetBounds) => targetBounds.y + targetBounds.height / 2,
            () => this.targetRect.height >= 20,
        );
        const leftBottom = new ResizeHandle(this, this.store, "sw-resize",
            getLocalValue,
            (delta) => {
                if (this.targetRect.height - delta.y > 3) {
                    this.targetRect.height = this.targetRect.height - delta.y;
                }
                if (this.targetRect.width + delta.x > 3) {
                    this.targetRect.x -= delta.x;
                    this.targetRect.width += delta.x
                }
                this.rectChanged();
            },
            (targetBounds) => targetBounds.x,
            (targetBounds) => targetBounds.y + targetBounds.height,
            () => true,
        );

        this.visible = false;

        this.handles = [bottomRight, topRight, topLeft, top, bottom, leftBottom, right, left];
        this.addChild(this.graphics);
        this.handles.forEach(c => this.addChild(c))
        this.redraw();
    }

    private rectChanged() {
        this.onRectChanged.emit(this.targetRect);
        this.redraw();
    }


    private redraw() {
        this.graphics.clear();
        this.handles.forEach(r => r.redraw());
        this.graphics.lineStyle(3 / Resizer.getGlobalScale(this), 0x999999);
        this.graphics.beginFill(0x999999,0);
        this.graphics.drawRect(this.targetRect.x,this.targetRect.y,this.targetRect.width,this.targetRect.height);
        this.graphics.endFill();
        this.handles.forEach(handle => handle.reposition(this.targetRect));
    }

    static getGlobalScale(curr: PIXI.Container) {
        let scale = 1;
        while(curr.parent) {
            scale *= curr.parent.scale.x;
            curr = curr.parent;
        }
        return scale;
    }

    public static fitIntoRect(
        bounds: {x: number; y: number, width: number, height: number},
        fittingTarget: PIXI.Sprite,
        fit: BBoxFit,
        horizontalAlign: AlignHorizontal = AlignHorizontal.center,
        verticalAlign: AlignVertical = AlignVertical.center,
    ) {
        let fitIntoBox: boolean;
        let mayEnlarge: boolean;
        let exactFit: boolean = false;
        switch (fit) {
            case BBoxFit.noFit:
                fitIntoBox = false;
                mayEnlarge = false;
                break;
            case BBoxFit.contain:
                fitIntoBox = true;
                mayEnlarge = true;
                break;
            case BBoxFit.containNoEnlarge:
                fitIntoBox = true;
                mayEnlarge = false;
                break;
            case BBoxFit.cover:
                fitIntoBox = false;
                mayEnlarge = false;
                exactFit = true;
                break;
            default:
                throw new Error("BoundingBoxFitType '" + fit + "' is unknown!");
        }
        if (fitIntoBox) {
            const baseWidth = fittingTarget.width / fittingTarget.scale.x;
            const baseHeight = fittingTarget.height / fittingTarget.scale.y;
            fittingTarget.scale.set(scaleIntoBox(baseWidth, baseHeight, bounds.width, bounds.height, mayEnlarge));
        } else if (exactFit) {
            const baseWidth = fittingTarget.width / fittingTarget.scale.x;
            const baseHeight = fittingTarget.height / fittingTarget.scale.y;
            fittingTarget.scale.set(bounds.width / baseWidth, bounds.height / baseHeight);
        }
        switch(horizontalAlign) {
            case "center":
                fittingTarget.x = bounds.x + (bounds.width - fittingTarget.width) / 2
                    + (fittingTarget.width * (fittingTarget.anchor.x)); // für den anchor
                break;
            case "left":
                fittingTarget.x = bounds.x
                    + (fittingTarget.width * (fittingTarget.anchor.x)); // für den anchor
                break;
            case "right":
                fittingTarget.x = bounds.x + bounds.width - fittingTarget.width
                    + (fittingTarget.width * (fittingTarget.anchor.x)); // für den anchor
                break;
        }

        switch(verticalAlign) {
            case "center":
                fittingTarget.y = bounds.y + (bounds.height - fittingTarget.height) / 2
                    + (fittingTarget.height * (fittingTarget.anchor.y)); // für den anchor
                break;
            case "top":
                fittingTarget.y = bounds.y
                    + (fittingTarget.height * (fittingTarget.anchor.y)); // für den anchor
                break;
            case "bottom":
                fittingTarget.y = bounds.y + bounds.height - fittingTarget.height
                    + (fittingTarget.height * (fittingTarget.anchor.y)); // für den anchor
                break;
        }

    }
}

