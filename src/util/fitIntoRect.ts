import * as PIXI from "pixi.js";
import {BBoxFit} from "../store/elements/IElement";
import {scaleIntoBox} from "./scaleIntoBox";
import {AlignHorizontal, AlignVertical} from "../manipulators/Resizer2";

export const fitIntoRect = (
    bounds: { x: number; y: number, width: number, height: number },
    fittingTarget: PIXI.Sprite,
    fit: BBoxFit,
    horizontalAlign: AlignHorizontal = AlignHorizontal.center,
    verticalAlign: AlignVertical = AlignVertical.center,
) => {
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
    switch (horizontalAlign) {
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

    switch (verticalAlign) {
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