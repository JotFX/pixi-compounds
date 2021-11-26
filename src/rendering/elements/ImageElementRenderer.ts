import {IElementRenderer} from "./IElementRenderer";
import * as PIXI from "pixi.js";
import {ImageElement} from "../../store/elements/ImageElement";
import {RootStore} from "../../store/RootStore";
import {autorun, IReactionDisposer, reaction} from "mobx";
import {Resizer} from "../../manipulators/Resizer";
import {emptyImage} from "../../store/ImageStore";


export class ImageElementRenderer extends PIXI.Sprite
    implements IElementRenderer {
    constructor(private readonly model: ImageElement) {
        super(PIXI.Texture.from(emptyImage));
    }

    private reactionDisposer: IReactionDisposer | undefined;

    startReactivity(store: RootStore) {
        this.reactionDisposer = reaction(() => ({
                imageId: this.model.imageId,
                bboxValues: Object.values(this.model.bbox)
            }),
            () => {
                this.scale.set(1, 1);
                this.texture = store.imageStore.getTexture(this.model.imageId);
                Resizer.fitIntoRect(this.model.bbox, this, this.model.bbox.fit, this.model.bbox.horizontalAlign, this.model.bbox.verticalAlign);
            }, {fireImmediately: true})
    }


    stopReactivity() {
        this.reactionDisposer && this.reactionDisposer();
    }
}
