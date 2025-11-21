/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import TabItem               from './v-item';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-tab-vertical';

/**
 * Tab
 */
export default class Tab extends Element {
    /**
     * 回调函数
     */
    #on_item_changed_callback;

    /**
     * 元素
     */
    #container;

    /**
     * 设置回调
     * 
     * @param {function} callback
     */
    set onitemchanged(callback) {
        if (isFunction(callback)) {
            this.#on_item_changed_callback = callback;
        } else {
            this.#on_item_changed_callback = undefined;
        }
    }

    /**
     * 获取回调
     */
    get onitemchanged() {
        return this.#on_item_changed_callback;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
    }

    /**
     * 
     * Item
     * 
     * @param {*} item 
     */
    onItemSelected(item) {
        const slot_container = this.#container.children[0].assignedNodes();
        for (const child of slot_container) {
            if (child == item) {
                continue;
            } else if (child instanceof TabItem) {
                child.setSelected(false);
            }
        }

        if (this.#on_item_changed_callback) {
            this.#on_item_changed_callback(item);
        }
    }
}

CustomElementRegister(tagName, Tab);
