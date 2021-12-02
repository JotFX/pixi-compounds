import {reaction} from "mobx";
import {RootStore} from "./RootStore";
import {ImExporter} from "./ImExporter";
import {debounce} from "../util/debounce";

export class SessionSaver {



    constructor(
        private readonly store: RootStore,
        private readonly imExporter: ImExporter) {

        const debouncedSave = debounce(this.saveDataAndTree.bind(this), 500);

        reaction(() => ({
            values: store.flatTemplateElementArray.map(e => Object.values(e)),
            bboxes: store.flatTemplateElementArray.map(e => Object.values(e.bbox)),
            tree: store.treeStructure
        }), (elements) => debouncedSave());

        reaction(() => this.store.imageStore.imageArray.slice(0),
            images => {
                const imageData = JSON.stringify(images);
                sessionStorage.setItem("images", imageData);
            });
    }

    private saveDataAndTree() {
        console.log("saving tree and data");
        sessionStorage.setItem("data", this.imExporter.getElementJsonString());
        sessionStorage.setItem("tree", this.imExporter.getTreeJsonString());
    }

    loadSessionData() {
        const data = sessionStorage.getItem("data");
        const tree = sessionStorage.getItem("tree");
        const images = sessionStorage.getItem("images");
        if (images) {
            this.imExporter.loadImages(images);
        }
        if (data && tree) {
            this.imExporter.loadElementJsonString(data);
            this.imExporter.loadTreeJsonString(tree);
        }
    }

}