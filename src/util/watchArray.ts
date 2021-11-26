import {autorun, reaction} from "mobx";

export interface IIdentifiable {
    id: string;
}

export function watchArray<T extends IIdentifiable, S>(
    arrayProvider: () => T[],
    enterFunction: (item: T, index?: number) => S | void,
    exitFunction?: (item: T, view?: S, index?: number) => void,
    viewUpdate?: (views: S[]) => void
) {

    let currentItems = new Map<string | number, T>();
    const views = new Map<string | number, S>();

    reaction(() => arrayProvider().slice(), (nextEntities) => {
        const newEntities = arrayWithoutMapValues<T>(nextEntities, currentItems);
        const oldEntities = removeArrayValuesFromMap<T>(currentItems, nextEntities);
        currentItems = new Map<any, T>(nextEntities.map(item => [item.id, item]));
        newEntities.forEach((item, index) => {
            const view = enterFunction(item, index);
            if (view) {
                views.set(item.id, view);
            }
        });
        oldEntities.forEach((item, index) => {
            const view = views.get(item.id);
            if (view) {
                views.delete(item.id);
            }
            if (exitFunction) {
                exitFunction(item, view, index);
            }
        });
        if (viewUpdate) {
            viewUpdate(Array.from(views.values()));
        }
    }, {fireImmediately: true});
}

function arrayWithoutMapValues<S>(arr: any, map: any): S[] {
    return arr.filter((item: { id: any; }) => !map.has(item.id));
}

function removeArrayValuesFromMap<S>(map: Map<any, S>, arr: any): Map<any, S> {
    arr.forEach((item: { id: any; }) => map.delete(item.id));
    return map;
}