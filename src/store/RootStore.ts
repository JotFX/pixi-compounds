import {IObservableArray, makeAutoObservable} from "mobx";
import {ImageStore} from "./ImageStore";
import {ElementType, IElement} from "./elements/IElement";
import {ShapeElement} from "./elements/ShapeElement";
import {ImageElement} from "./elements/ImageElement";
import {TextElement} from "./elements/TextElement";

export class RootStore {
  width: number = 600;
  height: number = 300;
  showCenter: boolean = true;
  backgroundColor: number = 0x000000;
  gridSize: number = 10;
  errors: IObservableArray<string> = [] as unknown as IObservableArray;
  imageStore: ImageStore = new ImageStore(this);
  selectedElement: IElement | null = null;
  templateElements: IObservableArray<IElement> = [] as unknown as IObservableArray;
  clearTemplateElements() {
    this.templateElements = [] as unknown as IObservableArray;
  }
  constructor() {
    makeAutoObservable(this);
  }
  setSelectedElement(el: IElement) {
    this.selectedElement = el;
  }
  addElement(el: IElement) {
    this.templateElements.push(el);
    this.setSelectedElement(el);
  }

  parseElement(el: IElement) {
    let parsedElement: IElement;
    switch(el.type) {
      case ElementType.Shape:
        parsedElement = new ShapeElement();
        break;
      case ElementType.Image:
        parsedElement = new ImageElement();
        break;
      case ElementType.Text:
        parsedElement = new TextElement();
        break;
      default:
        console.error("unknown element type: ", el.type, el);
        throw new Error("unknown element type: " + el.type);
    }
    parsedElement.readFromItem(el);
    this.addElement(parsedElement);
  }
  swapElements(a: IElement, b: IElement) {
    const ai = this.templateElements.indexOf(a);
    const bi = this.templateElements.indexOf(b);
    if (ai >= 0 && bi >= 0) {
      this.templateElements[ai] = b;
      this.templateElements[bi] = a;
    }
  }
  removeElement(e: IElement) {
    this.templateElements.remove(e);
  }
}
