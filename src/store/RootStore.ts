import {IObservableArray, makeAutoObservable, ObservableMap} from "mobx";
import {ImageStore} from "./ImageStore";
import {ElementType, IElement} from "./elements/IElement";
import {ShapeElement} from "./elements/ShapeElement";
import {ImageElement} from "./elements/ImageElement";
import {TextElement} from "./elements/TextElement";
import {IListElement, ListElement} from "./elements/ListElement";

export interface TemplateTreeNode {
  id: string | null;
  title: string;
  subtitle?: string;
  children?: TemplateTreeNode[];
  expanded: boolean;
}

export type ElementID = string;

export class RootStore {
  width: number = 600;
  height: number = 300;
  showCenter: boolean = true;
  backgroundColor: number = 0x000000;
  gridSize: number = 10;
  errors: IObservableArray<string> = [] as unknown as IObservableArray;
  imageStore: ImageStore = new ImageStore(this);
  draggedFiles: any[] = [];
  selectedElement: IElement | null = null;

  templateElementList: IObservableArray<ListElement> = [] as unknown as IObservableArray;
  elementById: ObservableMap<string, IElement> = new ObservableMap<string, IElement>();


  constructor() {
    makeAutoObservable(this);
  }

  setSelectedNode(node: IListElement) {
    this.setSelectedElement(this.elementById.get(node.id)!);
  }

  uplateTemplateTreeStructure(nodes: IListElement[]) {
    this.templateElementList.replace(nodes.map(n => this.createListElement(n)));
  }

  private createListElement(node: IListElement): ListElement {
    const iElement = this.elementById.get(node.id)!;
    const listElement = new ListElement(iElement);
    listElement.children = node.children.map(c => this.createListElement(c));
    return listElement;
  }

  get treeStructure() {
    return this.templateElementList.map(el => el.getJSON());
  }

  get flatTemplateElementArray(): IElement[] {
    const list: IElement[] = [];
    // seiteneffekte!!
    this.flatElements(list, this.templateElementList);
    return list;
  }

  private flatElements(listToAppend: IElement[], currentElements: ListElement[]): IElement[] {
    listToAppend.concat(currentElements.map(e => e.element));
    currentElements.forEach(e => {
      listToAppend.push(e.element);
      if (e.children && e.children.length) {
        this.flatElements(listToAppend, e.children);
      }
    })
    return listToAppend;
  }

  clearTemplateElements() {
    this.templateElementList.clear();
  }
  setDraggedFiles(files: any[]) {
    this.draggedFiles = files;
  }
  setSelectedElement(el: IElement | null) {
    this.selectedElement = el;
  }
  addElement(el: IElement, selectElement: boolean = true) {
    const listElement = new ListElement(el);
    this.elementById.set(el.id, el);
    this.templateElementList.push(listElement);
    if (selectElement) {
      this.setSelectedElement(el);
    }
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
    this.addElement(parsedElement, false);
  }

}
