import * as PIXI from "pixi.js";
import {IRectLike} from "../manipulators/Resizer2";

// transformiert ein PIXI.Rect in die lokalen Raum der transform
// im Prinzip lässt sich damit "getBounds()" rückwärts rechnen
// const bounds = target.getBounds()
// const localBounds = transformRect(bounds, target.transform);
export const transformRectToWorld = (r: IRectLike, transform: PIXI.Transform): PIXI.Rectangle => {
    const transformedRect = new PIXI.Rectangle(r.x, r.y, r.width, r.height);
    const p = new PIXI.Point;
    transform.worldTransform.apply(transformedRect, p);
    transformedRect.x = p.x;
    transformedRect.y = p.y;
    transformedRect.width *= transform.worldTransform.a;
    transformedRect.height *= transform.worldTransform.d;
    return transformedRect;
};

export const transformRectToLocal = (r: IRectLike, transform: PIXI.Transform): PIXI.Rectangle => {
    const transformedRect = new PIXI.Rectangle(r.x, r.y, r.width, r.height);
    const p = new PIXI.Point;
    transform.worldTransform.applyInverse(transformedRect, p);
    transformedRect.x = p.x;
    transformedRect.y = p.y;
    transformedRect.width /= transform.worldTransform.a;
    transformedRect.height /= transform.worldTransform.d;
    return transformedRect;
};