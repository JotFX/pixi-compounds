import {IElement} from "./IElement";

export interface IListElement {
    id: string;
    title: string;
    subtitle: string;
    expanded: boolean;
    children: IListElement[];
}

export class ListElement {
    get id() {
        return this.element.id;
    }
    children: ListElement[] = [];
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
    getJSON(): IListElement {
        return {
            id: this.id,
            expanded: this.expanded,
            title: this.title,
            subtitle: this.subtitle,
            children: this.children.map(c => c.getJSON())
        }
    }
}