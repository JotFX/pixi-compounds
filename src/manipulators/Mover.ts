import * as PIXI from "pixi.js";
import {Signal} from "typed-signals";
import {RootStore} from "../store/RootStore";

export class Mover {

    private target: PIXI.Container | undefined;
    private downStart: PIXI.Point | null = null;

    private onMouseDownHandler = this.onMouseDown.bind(this);
    private onMouseMoveHandler = this.onMouseMove.bind(this);
    private onMouseUpHandler;
    public onMoved: Signal<(target: PIXI.Container, delta: PIXI.Point) => void> = new Signal();

    constructor(
        private readonly parent: PIXI.Container,
        private readonly store: RootStore,
        ) {
        this.onMouseUpHandler = () => this.downStart = null;
        this.parent.interactive = true;
        this.parent.on("pointermove", this.onMouseMoveHandler);
    }

    setTarget(target: PIXI.Container) {
        if (this.target) {
            this.target.cursor = "";
            this.target.off("pointerdown", this.onMouseDownHandler);
            this.target.off("pointerup", this.onMouseUpHandler);
            this.target.off("pointerupoutside", this.onMouseUpHandler);
        }
        this.target = target;
        this.target.interactive = true;
        this.target.cursor = "all-scroll";
        this.target.on("pointerdown", this.onMouseDownHandler);
        this.target.on("pointerup", this.onMouseUpHandler);
        this.target.on("pointerupoutside", this.onMouseUpHandler);
    }

    private onMouseDown(interactionEvent: PIXI.InteractionEvent) {
        if (interactionEvent.target === this.target) {
            this.downStart = interactionEvent.data.global.clone();
        }
    }

    private onMouseMove(interactionEvent: PIXI.InteractionEvent) {
        if (this.downStart) {
            const current = interactionEvent.data.global.clone();
            const delta = new PIXI.Point(this.downStart.x - current.x, this.downStart.y - current.y);
            delta.x = this.snapTo(delta.x);
            delta.y = this.snapTo(delta.y);

            this.downStart.x -= delta.x;
            this.downStart.y -= delta.y;
            this.onMoved.emit(this.target!, delta);
        }
    }

    private snapTo(val: number): number {
        return Math.ceil(val / this.store.gridSize) * this.store.gridSize;
    }
}