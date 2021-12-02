import {RootStore} from "./RootStore";
import {ImageFile} from "./ImageStore";
import {makeAutoObservable} from "mobx";

export class ImExporter {
    constructor(private readonly store: RootStore) {
        makeAutoObservable(this);
    }

    getElementJsonString() {
        return JSON.stringify(this.store.flatTemplateElementArray.map(el => el.writeItem()), null, " ");
    }

    loadElementJsonString(content: string) {
        const list = JSON.parse(content) as any[];
        list.forEach(e => {
            this.store.parseElement(e);
        });
    }

    getTreeJsonString() {
        return JSON.stringify(this.store.treeStructure.slice(0), null, " ");
    }

    loadTreeJsonString(content: string) {
        const tree = JSON.parse(content);
        this.store.uplateTemplateTreeStructure(tree);
    }

    loadImages(content: string) {
        const images: ImageFile[] = JSON.parse(content);
        images.forEach(image => {
           this.store.imageStore.addFile(image.name, image.content);
        });
    }
}