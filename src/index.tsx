import { render } from "react-dom";

import { App } from "./App";
import { FileDropper } from "./FileDropper";
import { Renderer } from "./rendering/Renderer";
import { RootStore } from "./store/RootStore";
import { ZipInOut } from "./store/ZipInOut";
import {ImExporter} from "./store/ImExporter";
import {SessionSaver} from "./store/SessionSaver";

const store = new RootStore();
const imExporter = new ImExporter(store);
const sessionSaver = new SessionSaver(store, imExporter);
const inOut = new ZipInOut(store, imExporter);

const fileDropper = new FileDropper(store, (file, content) => {
  store.imageStore.addFile(file.name, content);
}, inOut);

const rootElement = document.getElementById("root");
render(<App onExport={() => inOut.export()} store={store} />, rootElement);

const renderer = new Renderer(store);

// erst am ende laden, wenn alles andere aufgebaut ist
sessionSaver.loadSessionData();