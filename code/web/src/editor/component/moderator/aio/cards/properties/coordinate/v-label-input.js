/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-label-input-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-coordinate-input';

/**
 * 位置信息
 */
export default class Input extends Element {
    /**
     * 元素
     */
    #input;

    /**
     * 获取
     */
    get value() {
        return this.#input.value;
    }

    /**
     * 设置
     */
    set value(data) {
        this.#input.value = data;
    }

    /**
     * 设置
     */
    set ondatachanged(callback) {
        this.#input.ondatachanged = callback;
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
        this.#input = this.getChild('#input');
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "title-data", 
                "title-token",
                "title-color",
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

        if ('title-data' === name) {
            this.setTitleData(_new);
        } else if ('title-token' === name) {
            this.setTitleToken(_new);
        } else if ('title-color' === name) {
            this.setTitleColor(_new);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setTitleData(data) {
        this.#input.setTitleData(data);
    }

    /**
     * 
     * 设置 Title Token
     * 
     * @param {*} token 
     */
    setTitleToken(token) {
        this.#input.setTitleToken(token);
    }

    /**
     * 设置 Title 颜色
     * 
     * @param {*} color 
     */
    setTitleColor(color) {
        this.#input.setTitleColor(color);
    }
}

CustomElementRegister(tagName, Input);
