import { render } from "react-dom";

import { App } from "./App";
import { FileDropper } from "./FileDropper";
import { Renderer } from "./rendering/Renderer";
import { RootStore } from "./store/RootStore";
import { ZipInOut } from "./ZipInOut";

const store = new RootStore();
const inOut = new ZipInOut(store);

const rootElement = document.getElementById("root");
render(<App onExport={() => inOut.export()} store={store} />, rootElement);

const renderer = new Renderer(store);

const fileDropper = new FileDropper((file, content) => {
  store.imageStore.addFile(file, content, Math.random().toFixed(36).substr(2));
  /*const img = document.createElement("img");
  // convert image file to base64 string
  img.src = content;
  document.body.appendChild(img);*/
});
