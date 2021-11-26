import {action, autorun, IObservableArray, makeAutoObservable} from "mobx";
import { ImageStore } from "./ImageStore";
import {IElement} from "./elements/IElement";

export class RootStore {
  width: number = 600;
  height: number = 300;
  showCenter: boolean = true;
  backgroundColor: number = 0x000000;
  gridSize: number = 10;
  errors: string[] = [];
  imageStore: ImageStore = new ImageStore(this);
  selectedElement: IElement | null = null;
  templateElements: IObservableArray<IElement> = [] as unknown as IObservableArray;

  constructor() {
    makeAutoObservable(this);
  }
  setSelectedElement(el: IElement) {
    this.selectedElement = el;
  }
  createElement(el: IElement) {
    this.templateElements.push(el);
    this.setSelectedElement(el);
  }
}
