import {IElementRenderer} from "./IElementRenderer";
import * as PIXI from "pixi.js";
import {ImageElement} from "../../store/elements/ImageElement";
import {RootStore} from "../../store/RootStore";
import {autorun, IReactionDisposer, reaction} from "mobx";
import {Resizer} from "../../manipulators/Resizer";
import {emptyImage} from "../../store/ImageStore";
import {TextElement} from "../../store/elements/TextElement";


export class TextElementRenderer extends PIXI.Text
    implements IElementRenderer {
    constructor(private readonly model: TextElement) {
        super(model.text);
    }

    private reactionDisposer: IReactionDisposer | undefined;

    startReactivity(store: RootStore) {
        this.reactionDisposer = reaction(() => ({
                text: this.model.text,
                bboxValues: Object.values(this.model.bbox)
            }),
            () => {
                this.scale.set(1, 1);
                this.text = this.model.text;
                Resizer.fitIntoRect(this.model.bbox, this, this.model.bbox.fit, this.model.bbox.horizontalAlign, this.model.bbox.verticalAlign);
            })
        autorun(() => {
            this.style = new PIXI.TextStyle({
                align: this.model.bbox.horizontalAlign,
                fontFamily: this.model.font,
                fontSize: this.model.fontSize,
                fill: this.model.textColor,
            });
        })
    }

    stopReactivity() {
        this.reactionDisposer && this.reactionDisposer();
    }
}
