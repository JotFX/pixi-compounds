import JSZip from "jszip";
// @ts-ignore;
import {saveAs} from "file-saver";
import {RootStore} from "./store/RootStore";

export class ZipInOut {

    constructor(private readonly store: RootStore) {

    }

    async streamToString(stream: NodeJS.ReadableStream) {
        const chunks: Buffer[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
    }

    async import(data: ArrayBuffer) {
        const zip = new JSZip();
        this.store.imageStore.clear();
        this.store.clearTemplateElements();
        await zip.loadAsync(data);
        zip.forEach(async (relativePath, file) => {
            try {

                if (relativePath.endsWith("data.json")) {
                    const content = await file.async("string");
                    const list = JSON.parse(content) as any[];
                    list.forEach(e => {
                        this.store.parseElement(e);
                    });
                } else {
                    const content = await file.async("base64");
                    const filetype = file.name.split(".").pop()!.toLowerCase();
                    const prefix = "data:image/" + filetype + ";base64,"
                    this.store.imageStore.addFile(file.name, prefix + content);
                }
            } catch (e) {
                console.error("Error parsing", relativePath, e);
            }
        });
    }

    export() {
        const zip = new JSZip();
        this.store.imageStore.imageArray.forEach((file) => {
            console.log("Adding to zip", file.name);
            const base64 = file.content.split("base64,")[1];
            zip.file(file.name, base64, {base64: true});
        });
        throw "parent child beziehungen müssen noch gespeichert werden";
        const data = JSON.stringify(this.store.flatTemplateElementArray.map(el => el.writeItem()), null, " ");
        zip.file("data.json", data);
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
