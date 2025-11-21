/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-button-borderless';

/**
 * 无边框的Icon按钮
 */
export default class IconButtonBorderless extends Element {
    /**
     * 元素
     */
    #svg;
    #btn;
    #btn_click_callback;

    /**
     * 设置按钮是否可用
     */
    set enable(value) {
        if (true === value) {
            this.#btn.setAttribute("enable", "true");
        } else {
            this.#btn.setAttribute("enable", "false");
        }
    }

    /**
     * 获取按钮是否可用
     */
    get enable() {
        return "true" === this.#btn.getAttribute("enable");
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
        this.setIcon(src);
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
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

        this.addEventListener('click', event => {
            event.stopPropagation();
        });
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
                "enable",
                "inset-padding",
                "icon-w",
                "icon-h",
                "icon-size",
            ]);
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
        } else if ('icon-w' == name) {
            this.#svg.style.width = _new;
        } else if ('icon-h' == name) {
            this.#svg.style.height = _new;
        } else if ('icon-size' == name) {
            this.#svg.style.width  = _new;
            this.#svg.style.height = _new;
        }
    }

    /**
     * 
     * 设置 ICON SVG
     * 
     * @param {string} src 
     */
    setIcon(src) {
        if (isString(src)) {
            this.#svg.setIcon(src);
        }
    }
}

CustomElementRegister(tagName, IconButtonBorderless);
