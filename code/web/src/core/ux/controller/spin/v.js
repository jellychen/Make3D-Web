/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-spin';

/**
 * 旋转动画
 */
export default class Spin extends Element {
    /**
     * 内部的元素
     */
    #container;
    #i0;
    #i1;
    #i2;
    #i3;

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
        this.#container = this.getChild('#container');
        this.#i0        = this.getChild('#i0');
        this.#i1        = this.getChild('#i1');
        this.#i2        = this.getChild('#i2');
        this.#i3        = this.getChild('#i3');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "color"
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
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
        
        if ("color" === name) {
            this.#i0.style.backgroundColor = _new;
            this.#i1.style.backgroundColor = _new;
            this.#i2.style.backgroundColor = _new;
            this.#i3.style.backgroundColor = _new;
        }
    }
}

CustomElementRegister(tagName, Spin);
