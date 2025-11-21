/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-label';

/**
 * 带有icon的文本
 */
export default class IconLabel extends Element {
    /**
     * 元素
     */
    #icon;
    #text;

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
        this.#icon = this.getChild('#icon');
        this.#text = this.getChild('#text');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon",
                "icon-color",
                "data", 
                "size", 
                "color", 
                "token", 
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

        if ('icon' == name ) {
            this.setIcon(_new);
        } else if ('icon-color' == name) {
            this.setIconColor(_new);
        } else if ('data' == name) {
            this.setData(_new);
        } else if ('size' == name) {
            this.setSize(_new);
        } else if ('color' == name) {
            this.setColor(_new);
        } else if ('token' == name) {
            this.setToken(_new);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} icon 
     */
    setIcon(icon) {
        this.#icon.setSrc(icon);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} color 
     */
    setIconColor(color) {
        this.#icon.setColor(color);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setData(data) {
        this.#text.setData(data);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setToken(data) {
        this.#text.setToken(data);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setColor(data) {
        this.#text.setColor(data);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setSize(data) {
        this.#text.setSize(data);
    }
}

CustomElementRegister(tagName, IconLabel);
