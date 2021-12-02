import {ZipInOut} from "./store/ZipInOut";
import {RootStore} from "./store/RootStore";

export class FileDropper {
  constructor(
      private readonly store: RootStore,
    private readonly fileReadHandler: (file: File, content: string) => void,
    private readonly zipInOut: ZipInOut,
  ) {
    document.body.ondragover = this.dragOverHandler.bind(this);
    document.body.ondragleave = this.dragOutHandler.bind(this);
    document.body.ondrop = this.dropHandler.bind(this);
  }

  dragOutHandler(ev: any) {
    this.store.setDraggedFiles([]);
  }

  dragOverHandler(ev: any) {
    ev.preventDefault();
    if (ev.dataTransfer.items?.length || ev.dataTransfer.files?.length) {
      this.store.setDraggedFiles(ev.dataTransfer.items || ev.dataTransfer.files);
    }
  }

  dropHandler(ev: any) {
    document.body.style.border = "";
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        const file = ev.dataTransfer.items[i];
        if (file.kind === "file") {
          this.handleFile(file.getAsFile());
        }
      }
    }
  }

  async handleFile(file: File) {
    if (
      file.name.toLowerCase().endsWith("jpg") ||
      file.name.toLowerCase().endsWith("png") ||
      file.name.toLowerCase().endsWith("webp") ||
      file.name.toLowerCase().endsWith("svg")
    ) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
          this.fileReadHandler(file, reader.result as string),
          false);
      reader.readAsDataURL(file);
    }
    else if (file.name.toLowerCase().endsWith("pcz")) {
      this.zipInOut.import(await file.arrayBuffer());
    }
  }
}
