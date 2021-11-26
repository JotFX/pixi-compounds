import JSZip from "jszip";
import { saveAs } from "file-saver";
import { RootStore } from "./store/RootStore";
export class ZipInOut {
  zip: JSZip;

  constructor(private readonly store: RootStore) {
    this.zip = new JSZip();
  }

  export() {
    this.store.files.forEach((file) => {
      console.log("Adding to zip", file.file.name);
      const base64 = file.content.split("base64,")[1];
      this.zip.file(file.file.name, base64, { base64: true });
    });
    this.zip.generateAsync({ type: "blob" }).then(function (content) {
      console.log("done zipping");
      // see FileSaver.js
      saveAs(content, "example.zip");
    });
  }
}
