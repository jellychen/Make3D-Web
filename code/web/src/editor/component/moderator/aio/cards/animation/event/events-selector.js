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
        icon      : 'event/loaded.svg',
        text_token: "event.loaded",
        token     : "loaded",
    },

    {
        sparator: true,
    },

    {
        icon      : 'event/key-down.svg',
        text_token: "event.keydown",
        token     : "keydown",
    },

    {
        icon      : 'event/key-up.svg',
        text_token: "event.keyup",
        token     : "keyup",
    },

    {
        icon      : 'event/key-press.svg',
        text_token: "event.keypress",
        token     : "keypress",
    },

    {
        sparator: true,
    },

    {
        icon      : 'event/pointer-down.svg',
        text_token: "event.pointer.down",
        token     : "pointer.down",
    },

    {
        icon      : 'event/pointer-up.svg',
        text_token: "event.pointer.up",
        token     : "pointer.down",
    },

    {
        icon      : 'event/pointer-hover.svg',
        text_token: "event.pointer.hover",
        token     : "pointer.hover",
    },

    {
        icon      : 'event/pointer-click.svg',
        text_token: "event.pointer.click",
        token     : "pointer.click",
    },

    {
        sparator: true,
    },

    {
        icon      : 'event/resize.svg',
        text_token: "event.resize",
        token     : "resize",
    },

    {
        icon      : 'event/scroll.svg',
        text_token: "event.scroll",
        token     : "scroll",
    },

    {
        sparator: true,
    },

    {
        icon      : 'event/timer.svg',
        text_token: "event.timer",
        token     : "timer",
    },

    {
        sparator: true,
    },

    {
        icon      : 'event/user-define.svg',
        text_token: "event.user.define",
        token     : "user.define",
    },
];

/**
 * 显示菜单
 */
class EventSelector {
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
        ComputePosition(ref_element, this.#menu, 'auto', 5);
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
 * 显示事件选择器
 * 
 * @param {*} callback 
 * @param {*} ref_element 
 * @returns 
 */
export default function ShowEventSelector(callback, ref_element) {
    const selector = new EventSelector(callback);
    selector.show(ref_element);
    return selector;
}
