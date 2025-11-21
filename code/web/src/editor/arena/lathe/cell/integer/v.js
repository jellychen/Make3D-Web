/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-lathe-integer';

/**
 * 调整整数
 */
export default class Integer extends Element {
    /**
     * 元素
     */
    #name;
    #number;

    /**
     * 标记类型
     */
    #token = "";

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
        this.#name = this.getChild('#name');
        this.#number = this.getChild('#number');
        this.#number.addEventListener('changed', (event) => {
            this.bubblesEvent({
                token: this.#token,
                element: this,
            });
        });
    }
    
    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name-token",
                "token",
                "range-start",
                "range-end",
                "default",
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

        if ('name-token' == name) {
            this.setNameToken(_new);
        } else if ('token' == name) {
            this.#token = _new;
        } else if ('range-start' == name) {
            this.#number.setRangeMin(parseInt(_new));
        } else if ('range-end' == name) {
            this.#number.setRangeMax(parseInt(_new));
        } else if ('default' == name) {
            this.setValue(parseFloat(_new));
        }
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        this.#name.setToken(token);
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value 
     */
    setValue(value) {
        this.#number.setValue(parseInt(value));
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    getValue() {
        return this.#number.getValue();
    }
}

CustomElementRegister(tagName, Integer);
