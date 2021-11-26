import {IElementRenderer} from "./IElementRenderer";
import * as PIXI from "pixi.js";
import {ImageElement} from "../../store/elements/ImageElement";
import {RootStore} from "../../store/RootStore";
import {autorun, IReactionDisposer, reaction} from "mobx";
import {Resizer} from "../../manipulators/Resizer";
import {emptyImage} from "../../store/ImageStore";
import {TextElement} from "../../store/elements/TextElement";
import {ShapeElement, ShapeSurface, ShapeType} from "../../store/elements/ShapeElement";
import {BBox} from "../../store/elements/IElement";


export class ShapeElementRenderer extends PIXI.Container
    implements IElementRenderer {

    constructor(private readonly model: ShapeElement) {
        super();
        this.shape = new PIXI.Graphics();
        this.addChild(this.shape);
    }

    private shape: PIXI.Graphics;
    private sprite: PIXI.TilingSprite | undefined;

    private reactionDisposer: IReactionDisposer | undefined;

    async startReactivity(store: RootStore) {
        this.reactionDisposer = autorun(() => {

            if (this.model.surface === ShapeSurface.texture) {
                const texture = store.imageStore.getTexture(this.model.textureId);
                if (!this.sprite) {
                    this.sprite = new PIXI.TilingSprite(texture, 5000, 5000);
                } else {
                    this.sprite.texture = texture;
                }
                const scale = Math.max(0, Math.min(100, this.model.textureScale));
                this.sprite.tileScale.set(scale);
                this.sprite.x = -2500;
                this.sprite.y = -2500;
                this.sprite.mask = this.shape;
                this.addChild(this.sprite);
            } else {
                this.removeChild(this.sprite!);
            }

            this.drawGraphics(this.model.bbox);
        });

    }

    private drawGraphics(bbox: BBox) {
        this.shape.clear();
        this.shape.beginFill(this.model.color);
        switch (this.model.shape) {
            case ShapeType.circle:
                this.x = bbox.x + bbox.width / 2;
                this.y = bbox.y + bbox.height / 2;
                this.shape.drawCircle(0, 0, Math.min(bbox.width, bbox.height) / 2);
                break;
            case ShapeType.rect:
                this.shape.drawRect(bbox.x, bbox.y, bbox.width, bbox.height);
                break;
            case ShapeType.rounded_rect:
                this.shape.drawRoundedRect(bbox.x, bbox.y, bbox.width, bbox.height, this.model.radius);
                break;
            case ShapeType.hexagon:
                this.shape.drawPolygon(ShapeElementRenderer.getHexShape(
                    bbox.x + bbox.width / 2,
                    bbox.y + bbox.height / 2,
                    Math.min(bbox.width, bbox.height) / 2));
                break;
            case ShapeType.flat_hexagon:
                this.shape.drawPolygon(ShapeElementRenderer.getFlatHexShaped(
                    bbox.x + bbox.width / 2,
                    bbox.y + bbox.height / 2,
                    Math.min(bbox.width, bbox.height) / 2));
                break;
            default:
                throw new Error("BackgroundShapeRenderer: Wrong shape type");
        }
        this.shape.endFill();
    }

    stopReactivity() {
        this.reactionDisposer && this.reactionDisposer();
    }


    private static getHexShape(x: number, y: number, size: number): number[] {
        const additionalRotation = Math.PI / 6;
        return ShapeElementRenderer.getFlatHexShaped(x, y, size, additionalRotation);
    }

    private static getFlatHexShaped(x: number, y: number, size: number, additionalRotation: number = 0): number[] {
        const coords = [
            x + size * Math.cos(additionalRotation),
            y + size * Math.sin(additionalRotation),
        ]
        for (let side = 0; side < 7; side++) {
            coords.push(x + size * Math.cos(side * 2 * Math.PI / 6 + additionalRotation));
            coords.push(y + size * Math.sin(side * 2 * Math.PI / 6 + additionalRotation));
        }
        return coords;
    }
}
