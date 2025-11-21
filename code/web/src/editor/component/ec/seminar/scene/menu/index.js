/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import Position            from '@common/misc/compute-visible-position';
import DropMenu            from '@ux/controller/drop-menu';
import OpenDropperReceiver from '@editor/arena/droppers-receiver';

/**
 * 构建菜单的数据
 */
const menu_item_data = [
    // 移除所选项
    {
        icon      : 'ui/delete.svg',
        token     : 'delete.selected',
        text_token: "delete.selected",
    },

    // 导入
    {
        icon      : 'ui/import.svg',
        token     : 'import',
        text_token: "import",
    },

    // 重置相机
    {
        icon      : 'ui/reset.svg',
        token     : 'reset.camera',
        text_token: "reset.camera",
    },
];

/**
 * 下拉菜单
 */
export default class SceneDropMenu {
    /**
     * 协调器
     */
    #coordinator;

    /**
     * 宿主
     */
    #host;

    /**
     * 菜单
     */
    #menu;

    /**
     * 
     * 构造函数
     * 
     * @param {*} coordinator 
     * @param {*} host 
     */
    constructor(coordinator, host) {
        this.#coordinator = coordinator;
        this.#host        = host;
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
        case 'delete.selected':
            return this.#onClick_DeleteSelected();
        case 'import':
            return this.#onClick_Import();
        case 'reset.camera':
            return this.#onClick_ResetCamera();
        }
    }

    /**
     * 取消
     */
    #onCancel() {
        this.#menu = undefined;
    }

    /**
     * 点击了删除选择
     */
    #onClick_DeleteSelected() {
        this.#host.removeAllSelectedObjects();
    }

    /**
     * 点击了导入
     */
    #onClick_Import() {
        OpenDropperReceiver(this.#coordinator);
    }

    /**
     * 点击重置相机
     */
    #onClick_ResetCamera() {
        this.#coordinator.cinderella.getOrbit().animationRotateToDefault();
        this.#coordinator.renderNextFrame();
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
