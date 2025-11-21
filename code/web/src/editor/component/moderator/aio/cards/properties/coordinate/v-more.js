/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import isFunction      from 'lodash/isFunction';
import ComputePosition from '@common/misc/compute-position';
import DropMenu        from '@ux/controller/drop-menu';

/**
 * 构建菜单的数据
 */
const menu_item_data = [
    {
        text_token: "apply.transform.correction",
        token:      "apply.transform.correction",
    },

    {
        sparator: true,
    },

    {
        icon      : 'ui/gear.svg',
        text_token: "apply.transform.scale",
        token:      "apply.transform.scale",
    },

    {
        text_token: "apply.transform.rotation",
        token:      "apply.transform.rotation",
    },

    {
        text_token: "apply.transform.scale-rotation",
        token:      "apply.transform.scale-rotation",
    },

    {
        text_token: "apply.transform.all",
        token:      "apply.transform.all",
    },

    {
        sparator: true,
    },

    {
        icon      : 'ui/reset.svg',
        text_token: "reset.transform.translate",
        token:      "reset.transform.translate",
    },

    {
        text_token: "reset.transform.scale",
        token:      "reset.transform.scale",
    },

    {
        text_token: "reset.transform.rotation",
        token:      "reset.transform.rotation",
    },

    {
        text_token: "reset.transform.all",
        token:      "reset.transform.all",
    },
];

/**
 * 下来菜单
 */
export default class MoreMenu {
    /**
     * 回调函数
     */
    #callback;

    /**
     * 菜单
     */
    #menu;

    /**
     * 
     * 构造函数
     * 
     * @param {*} callback 
     */
    constructor(callback) {
        this.#callback = callback;
    }

    /**
     * 
     * 显示
     * 
     * @param {*} ref_element 
     */
    show(ref_element) {
        // 构建菜单
        this.#menu = DropMenu(
            menu_item_data,
            (token) => this.#onSelected(token),
            (     ) => this.#onCancel(),
            false, 
            true);
        document.body.appendChild(this.#menu);

        // 计算位置
        ComputePosition(ref_element, this.#menu, 'bottom-end', 5);
    }

    /**
     * 
     * 选中
     * 
     * @param {*} token 
     */
    #onSelected(token) {
        if (isFunction(this.#callback)) {
            this.#callback(token);
        }
    }

    /**
     * 取消
     */
    #onCancel() {
        ;
    }
}
