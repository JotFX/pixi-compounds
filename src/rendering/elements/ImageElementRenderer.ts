import {IElementRenderer} from "./IElementRenderer";
import * as PIXI from "pixi.js";
import {ImageElement} from "../../store/elements/ImageElement";
import {RootStore} from "../../store/RootStore";
import {autorun, IReactionDisposer, reaction} from "mobx";
import {Resizer2} from "../../manipulators/Resizer2";
import {emptyImage} from "../../store/ImageStore";
import {fitIntoRect} from "../../util/fitIntoRect";


export class ImageElementRenderer extends PIXI.Container
    implements IElementRenderer {
    private readonly sprite: PIXI.Sprite;
    private readonly childRenderers: PIXI.Container = new PIXI.Container;
    constructor(private readonly model: ImageElement) {
        super();
        this.sprite = new PIXI.Sprite(PIXI.Texture.from(emptyImage));
        this.addChild(this.sprite);
        this.addChild(this.childRenderers);
    }

    private reactionDisposer: IReactionDisposer | undefined;

    startReactivity(store: RootStore) {
        this.reactionDisposer = autorun(() => {
                this.sprite.scale.set(1, 1);
                this.sprite.texture = store.imageStore.getTexture(this.model.imageId);
                fitIntoRect(this.model.bbox, this.sprite, this.model.bbox.fit, this.model.bbox.horizontalAlign, this.model.bbox.verticalAlign);
                this.childRenderers.x = this.model.bbox.x;
                this.childRenderers.y = this.model.bbox.y;
            });
        /*this.reactionDisposer = reaction(() => ({
                imageId: this.model.imageId,
                bboxValues: Object.values(this.model.bbox),
                tree: store.treeStructure // es können neue kind eltern beziehungen auftreten
            }),
            () => {
                this.sprite.scale.set(1, 1);
                this.sprite.texture = store.imageStore.getTexture(this.model.imageId);
                fitIntoRect(this.model.bbox, this.sprite, this.model.bbox.fit, this.model.bbox.horizontalAlign, this.model.bbox.verticalAlign);
                this.childRenderers.x = this.model.bbox.x;
                this.childRenderers.y = this.model.bbox.y;
            }, {fireImmediately: true})*/
    }


    stopReactivity() {
        this.reactionDisposer && this.reactionDisposer();
    }

    addChildRenderer(child: IElementRenderer): void {
        this.childRenderers.addChild(child);
    }

    removeChildRenderers(): void {
        this.childRenderers.removeChildren();
    }
}
