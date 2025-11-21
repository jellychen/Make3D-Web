/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-1-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-separator-1';

/**
 * 分割
 */
export default class Separator extends Element {
    /**
     * 元素
     */
    #container;
    #svg;

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
        this.#svg       = this.getChild('#svg');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "color-top", 
                "color-bottom"
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

        if ('color-top' == name) {
            this.setColorTop(_new);
        } else if ('color-bottom' == name) {
            this.setColorBottom(_new);
        }
    }

    /**
     * 
     * 设置头部的颜色
     * 
     * @param {*} color 
     */
    setColorTop(color) {
        this.#container.style.backgroundColor = color;
    }

    /**
     * 
     * 设置底部的颜色
     * 
     * @param {*} color 
     */
    setColorBottom(color) {
        this.#svg.style.color = color;
    }
}

CustomElementRegister(tagName, Separator);
