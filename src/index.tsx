import { render } from "react-dom";

import { App } from "./App";
import { FileDropper } from "./FileDropper";
import { Renderer } from "./rendering/Renderer";
import { RootStore } from "./store/RootStore";
import { ZipInOut } from "./ZipInOut";

const store = new RootStore();
const inOut = new ZipInOut(store);

const fileDropper = new FileDropper(store, (file, content) => {
  store.imageStore.addFile(file.name, content);
}, inOut);

const rootElement = document.getElementById("root");
render(<App onExport={() => inOut.export()} store={store} />, rootElement);

const renderer = new Renderer(store);

