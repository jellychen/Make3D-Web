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
        icon      : 'ani/t.svg',
        text_token: "ani.translate",
        token     : "translate",
    },

    {
        icon      : 'ani/r.svg',
        text_token: "ani.rotate",
        token     : "rotate",
    },

    {
        icon      : 'ani/s.svg',
        text_token: "ani.scale",
        token     : "scale",
    },

    {
        sparator: true,
    },

    {
        icon      : 'ani/k.svg',
        text_token: "ani.keyframe",
        token     : "keyframe",
    },
];

/**
 * 下来菜单
 */
class MoreMenu {
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
        ComputePosition(ref_element, this.#menu, 'bottom-start', 5);
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

/**
 * 
 * 显示
 * 
 * @param {*} ref_element 
 * @param {*} callback 
 * @returns 
 */
export default function ShowAniSetter(ref_element, callback) {
    const menu = new MoreMenu(callback);
    menu.show(ref_element);
    return menu;
}
