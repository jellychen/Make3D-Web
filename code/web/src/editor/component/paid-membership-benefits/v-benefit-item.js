/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-benefit-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-paid-membership-benefits-item';

/**
 * 权益
 */
export default class Item extends Element {
    /**
     * 元素
     */
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
        this.#text = this.getChild('#text');
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "token", 
                "color",
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

        if ('token' == name) {
            this.setToken(_new);
        } else if ('color' == name) {
            this.setColor(_new);
        }
    }

    /**
     * 
     * 设置token
     * 
     * @param {*} token 
     */
    setToken(token) {
        this.#text.setToken(token);
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {*} color 
     */
    setColor(color) {
        this.#text.setColor(color);
    }
}

CustomElementRegister(tagName, Item);
