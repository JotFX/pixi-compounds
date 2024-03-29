
import SortableTree from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css'; // This only needs to be imported once in your app

import React, { Component } from 'react';
import {RootStore} from "../store/RootStore";
import {observer} from "mobx-react";
import {IListElement, ListElement} from "../store/elements/ListElement";

export const SortableOverview = observer((props: {store: RootStore}) => {
    const selectedId = props.store.selectedElement?.id;
    return <div id="treeBase" style={{ height: 400 }}>
        <SortableTree
            // @ts-ignore
            treeData={props.store.treeStructure}
            generateNodeProps={rowInfo => ({
                onClick: () => props.store.setSelectedNode(rowInfo.node as IListElement),
                // @ts-ignore
                style: {border: rowInfo.node.id === selectedId ? "2px solid black" : ""}
            })}
            onChange={treeData => props.store.uplateTemplateTreeStructure(treeData) }
        />
    </div>
});