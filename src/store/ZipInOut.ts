import JSZip from "jszip";
// @ts-ignore;
import {saveAs} from "file-saver";
import {RootStore} from "./RootStore";
import {ImExporter} from "./ImExporter";

export class ZipInOut {

    constructor(
        private readonly store: RootStore,
        private readonly imExporter: ImExporter) {}

    async import(data: ArrayBuffer) {
        const zip = new JSZip();
        this.store.imageStore.clear();
        this.store.clearTemplateElements();
        await zip.loadAsync(data);
        let elementContent = "";
        let treeContent = "";
        const promises: Promise<void>[] = [];
        zip.forEach((relativePath, file) => {
            promises.push(new Promise<void>(async resolve => {
                try {
                    if (relativePath.endsWith("elements.json")) {
                        elementContent = await file.async("string");
                    } else if (relativePath.endsWith("tree.json")) {
                        treeContent = await file.async("string");
                    } else {
                        const content = await file.async("base64");
                        const filetype = file.name.split(".").pop()!.toLowerCase();
                        const prefix = "data:image/" + filetype + ";base64,"
                        this.store.imageStore.addFile(file.name, prefix + content);
                    }
                    resolve(void 0);
                } catch (e) {
                    console.error("Error parsing", relativePath, e);
                }
            }));
        });
        // to load elements AFTER all images, we await all loading promises
        await Promise.all(promises);
        // PIXI seems to timeout their texture loading. WITHOUT "setTimeout" the textures are not ready yet
        setTimeout(() => {
            this.imExporter.loadElementJsonString(elementContent);
            this.imExporter.loadTreeJsonString(treeContent);
        }, 0);
    }

    export() {
        const zip = new JSZip();
        this.store.imageStore.imageArray.forEach((file) => {
            console.log("Adding to zip", file.name);
            const base64 = file.content.split("base64,")[1];
            zip.file(file.name, base64, {base64: true});
        });
        const data = this.imExporter.getElementJsonString();
        zip.file("elements.json", data);
        const tree = this.imExporter.getTreeJsonString();
        zip.file("tree.json", tree);
        zip.generateAsync({
            type: "blob", compressionOptions: {
                level: 9
            }
        }).then(function (content) {
            console.log("done zipping");
            // see FileSaver.js
            saveAs(content, "example.pcz");
        });
    }
}
