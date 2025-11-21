/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import XThree   from '@xthree/basic';
import Position from '@common/misc/compute-visible-position';
import DropMenu from '@ux/controller/drop-menu';

/**
 * 构建菜单的数据
 */
const menu_item_data = [
    {
        icon: "ui/folder.svg",
        text_token: "scene-tree.cell.menu.create.folder",
        token: "create.folder",
    },
];

/**
 * 下拉菜单
 */
export default class SceneCellDropMenu {
    /**
     * 场景
     */
    #scene;

    /**
     * 树
     */
    #tree;

    /**
     * 菜单
     */
    #menu;

    /**
     * 
     * 构造函数
     * 
     * @param {*} scene 
     * @param {*} tree 
     */
    constructor(scene, tree) {
        this.#scene = scene;
        this.#tree = tree;
    }

    /**
     * 
     * 显示菜单
     * 
     * @param {*} x 
     * @param {*} y 
     */
    show(x, y) {
        // 如果之前创建过先干掉
        this.dismiss();

        // 构建菜单
        this.#menu = DropMenu(
            menu_item_data,
            (token) => this.#onSelected(token),
            (     ) => this.#onCancel(),
            false, 
            true);
        document.body.appendChild(this.#menu);

        // 计算位置
        const w = document.body.clientWidth;
        const h = document.body.clientHeight;
        x = x || 0;
        y = y || 0;
        Position.ComputeVisiblePosition(this.#menu, x, y, w, h);
    }

    /**
     * 
     * 选中
     * 
     * @param {*} token 
     */
    #onSelected(token) {
        this.#menu = undefined;
        switch (token) {
        case 'create.folder':
            this.#onClick_CreateFolder();
            break;
        }
    }

    /**
     * 取消
     */
    #onCancel() {
        this.#menu = undefined;
    }

    /**
     * 点击了创建容器
     */
    #onClick_CreateFolder() {
        const group = new XThree.Group();
        group.setName('Group');
        this.#scene.add(group);
        this.#tree.markNeedUpdateTree(true);
    }

    /**
     * 取消
     */
    dismiss() {
        if (this.#menu) {
            this.#menu.dismiss();
            this.#menu = undefined;
        }
    }
}
