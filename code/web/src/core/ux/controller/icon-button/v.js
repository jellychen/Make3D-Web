/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-button';

/**
 * 图标按钮
 */
export default class IconButton extends Element {
    /**
     * 内部元素
     * */
    #svg;
    #btn;
    #btn_click_callback;

    /**
     * 设置按钮是否可用
     */
    set enable(value) {
        this.#btn.disabled = !value;
    }

    /**
     * 获取按钮是否可用
     */
    get enable() {
        return !(this.#btn.disabled);
    }

    /**
     * 设置点击的回调函数
     * 
     * @param {function} callback
     */
    set onclick(callback) {
        if (isFunction(callback)) {
            this.#btn_click_callback = callback;
        } else {
            this.#btn_click_callback = undefined;
        }
    }

    /**
     * 获取点击的回调函数
     */
    get onclick() {
        return this.#btn_click_callback;
    }

    /**
     * setIcon
     * 
     * @param {string} src
     */
    set icon(src) {
        if (isString(src)) {
            this.setIcon(src);
        }
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.#btn_click_callback = undefined;
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#svg = this.getChild('#icon');
        this.#btn = this.getChild('#btn');
        this.#btn.onclick = () => {
            this.dispatchUserDefineEvent('client', {});
            if (this.#btn_click_callback) {
                this.#btn_click_callback(this);
            }
        };
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
                "enable",
            ])
        }
        return this.attributes;
    }

    /**
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

        if ('icon' == name) {
            this.setIcon(_new);
        } else if ('enable' == name) {
            this.enable = ('false' != _new);
        }
    }

    /**
     * 
     * 设置 ICON SVG
     * 
     * @param {*} src 
     */
    setIcon(src) {
        this.#svg.setIcon(src);
    }
}

CustomElementRegister(tagName, IconButton);
