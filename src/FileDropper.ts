export class FileDropper {
  constructor(
    private readonly fileReadHandler: (file: File, content: string) => void
  ) {
    document.body.ondragover = this.dragOverHandler.bind(this);
    document.body.ondragleave = this.dragOutHandler.bind(this);
    document.body.ondrop = this.dropHandler.bind(this);
  }

  dragOutHandler(ev: any) {
    document.body.style.border = "";
  }

  dragOverHandler(ev: any) {
    ev.preventDefault();
    document.body.style.border = "3px solid red";
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

  handleFile(file: File) {
    if (
      file.name.toLowerCase().endsWith("jpg") ||
      file.name.toLowerCase().endsWith("png") ||
      file.name.toLowerCase().endsWith("webp")
    )
      console.log("File", file.name);

    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.fileReadHandler(file, reader.result as string);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
