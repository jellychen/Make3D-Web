/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-tag-vip';

export default class TagVip extends Element {
    /**
     * 元素
     */
    #icon;

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
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "color",
                "location",
                "small",
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
        
        if ('color' == name) {
            this.setColor(_new);
        } else if ('location' == name) {
            this.setLocation(_new);
        } else if ('small' == name) {
            this.setSmall(_new === 'true');
        }
    }

    /**
     * 
     * CSS Color
     * 
     * @param {string} color 
     */
    setColor(color) {
        this.#icon.setColor(color);
    }

    /**
     * 
     * 设置位置
     * 
     * @param {*} location 
     */
    setLocation(location) {
        this.#icon.setAttribute('location', location);
    }

    /**
     * 
     * 设置是不是小型的
     * 
     * @param {*} small 
     */
    setSmall(small) {
        if (small) {
            this.#icon.setAttribute('small', 'true');
        } else {
            this.#icon.setAttribute('small', 'false');
        }
    }
}

CustomElementRegister(tagName, TagVip);
