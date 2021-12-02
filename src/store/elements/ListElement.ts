import {IElement} from "./IElement";

export class ListElement {
    get id() {
        return this.element.id;
    }
    children: IElement[] = [];
    expanded: boolean = true;
    constructor(
        public readonly element: IElement) {
    }
    get title() {
        return this.element.title;
    }
    get subtitle() {
        return this.element.type;
    }
}