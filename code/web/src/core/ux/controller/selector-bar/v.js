/* eslint-disable no-unused-vars */

import isUndefined           from 'lodash/isUndefined';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-selector-bar';

/**
 * 选择框
 */
export default class SelectorBar extends Element {
    /**
     * 元素
     */
    #container;
    #token;

    /**
     * 回调函数
     */
    on_data_changed;

    /**
     * 获取
     */
    get token() {
        return this.#token;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.observerBubblesEvent();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "dir",
                "default",
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性设置
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('dir' == name) {
            this.setDir(_new);
        } else if ('default' == name) {
            this.selectToken(_new);
        }
    }

    /**
     * 
     * 设置方向
     * 
     * @param {*} dir 
     */
    setDir(dir) {
        this.#container.setAttribute('dir', dir);
    }

    /**
     * 
     * 选择指定的Token的元素
     * 
     * @param {*} token 
     */
    setToken(token) {
        this.selectToken(token);
    }

    /**
     * 
     * 选择指定的Token的元素
     * 
     * @param {*} token 
     */
    selectToken(token) {
        if (isUndefined(token)) {
            return;
        }

        this.#token = token;
        this.nextFrameTick(() => {
            const slot = this.#container.querySelector('slot');
            const eles = slot.assignedElements({ flatten: true });
            if (eles) {
                for (let i = 0; i < eles.length; ++i) {
                    const ele = eles[i];
                    if (!isFunction(ele.setSelected)) {
                        continue;   
                    }

                    if (ele.token == token) {
                        ele.setSelected(true);
                    } else {
                        ele.setSelected(false);
                    }
                }
            }
        });
    }

    /**
     * 
     * 接收孩子的冒泡事件
     * 
     * @param {*} event 
     */
    onRecvBubblesEvent(event) {
        event.stopPropagation();
        super.onRecvBubblesEvent(event);
        const item = event.detail.item;
        if (!item) {
            return;
        }

        if (item.token == this.#token) {
            return;
        }

        this.selectToken(item.token);
        this.dispatchUserDefineEvent('changed', {
            data: this.#token
        });

        if (isFunction(this.on_data_changed)) {
            this.on_data_changed(this.#token);
        }
    }
}

CustomElementRegister(tagName, SelectorBar);
