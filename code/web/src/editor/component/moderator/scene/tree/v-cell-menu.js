/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isFunction from 'lodash/isFunction';
import Position   from '@common/misc/compute-visible-position';
import DropMenu   from '@ux/controller/drop-menu';

/**
 * 构建菜单的数据
 */
const menu_item_data = [
    {
        icon: "ui/edit.svg",
        text_token: "scene-tree.cell.menu.rename",
        token: "rename",
    },

    {
        icon: "ui/remove.svg",
        text_token: "scene-tree.cell.menu.delete",
        token: "remove",
    },

    {
        icon: "ui/copy.svg",
        text_token: "scene-tree.cell.menu.duplicate",
        token: "duplicate",
    },

    {
        icon: "ui/folder.svg",
        text_token: "scene-tree.cell.menu.create.folder",
        token: "create.folder",
    },

    {
        sparator: true,
    },

    {
        text_token: "scene-tree.cell.menu.reset.position",
        token: "reset.position",
    },

    {
        text_token: "scene-tree.cell.menu.reset.scale",
        token: "reset.scale",
    },

    {
        text_token: "scene-tree.cell.menu.reset.rotation",
        token: "reset.rotation",
    },

    {
        text_token: "scene-tree.cell.menu.reset.transform",
        token: "reset.transform",
    },

    {
        sparator: true,
    },

    {
        icon: "ui/eye.svg",
        text_token: "scene-tree.cell.menu.reset.show_hide",
        token: "show-hide",
    },
];

/**
 * 下拉菜单
 */
export default class CellDropMenu {
    /**
     * 所属的Cell
     */
    #host_cell;

    /**
     * 回调函数
     */
    #on_selected_callback;

    /**
     * 菜单
     */
    #menu;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host_cell 
     * @param {*} callback 
     */
    constructor(host_cell, callback = undefined) {
        this.#host_cell = host_cell;
        this.#on_selected_callback = callback;
    }

    /**
     * 
     * 显示菜单
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    show(x, y) {
        // 设置Cell被Hit
        this.#host_cell.setHit(true);

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
        this.#host_cell.setHit(false);
        this.#menu = undefined;
        if (isFunction(this.#on_selected_callback)) {
            this.#on_selected_callback(token);
        }
    }

    /**
     * 取消
     */
    #onCancel() {
        this.#host_cell.setHit(false);
        this.#menu = undefined;
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
