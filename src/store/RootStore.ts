import {IObservableArray, makeAutoObservable, ObservableMap} from "mobx";
import {ImageStore} from "./ImageStore";
import {ElementType, IElement} from "./elements/IElement";
import {ShapeElement} from "./elements/ShapeElement";
import {ImageElement} from "./elements/ImageElement";
import {TextElement} from "./elements/TextElement";

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


  // templateElementArray: IObservableArray<IElement> = [] as unknown as IObservableArray;

  templateElements: ObservableMap<ElementID, IElement> = new ObservableMap();

  get templateElementTree(): TemplateTreeNode[] {
    const treeNodes = new Map<ElementID | null, TemplateTreeNode>();
    const getNode = (el: IElement | null) => {
      const id = el?.id || null;
      if (!treeNodes.has(id)) {
        treeNodes.set(id, {id, title: el?.title || "Root", children: [], expanded: true, subtitle: el?.type });
      }
      return treeNodes.get(id)!;
    };
    this.templateElements.forEach((el, key) => {
      const parent = getNode(el.parent || null);
      const self = getNode(el);
      parent.children?.push(self);
    });
    // root node zurück geben
    return getNode(null).children!;
  }

  setSelectedNode(id: string | null) {
    const templateElement = this.templateElements.get(id as string)!;
    this.setSelectedElement(templateElement);
  }

  uplateTemplateTreeStructure(nodes: TemplateTreeNode[], parent: TemplateTreeNode | null = null) {
    nodes.forEach(node => {
      const templateElement = this.templateElements.get(node.id as string)!;
      if (parent === null) {
        templateElement.parent = null;
      } else {
        templateElement.parent = this.templateElements.get(parent.id as string)!
      }
      if (node.children) {
        this.uplateTemplateTreeStructure(node.children, node);
      }
    });
    if (parent === null) {
      console.log("templateElementArray", this.templateElementArray.map(e => e.parent?.id).join(", "));
    }
  }
  get templateElementArray() {
    return Array.from(this.templateElements.values());
  }




  clearTemplateElements() {
    this.templateElements.clear();
  }
  constructor() {
    makeAutoObservable(this);
  }
  setDraggedFiles(files: any[]) {
    this.draggedFiles = files;
  }
  setSelectedElement(el: IElement | null) {
    this.selectedElement = el;
  }
  addElement(el: IElement) {
    this.templateElements.set(el.id, el);
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
  removeElement(e: IElement) {
    this.templateElements.delete(e.id);
  }
}
