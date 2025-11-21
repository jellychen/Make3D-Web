/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-lathe-switcher';

/**
 * 开关
 */
export default class Switcher extends Element {
    /**
     * 元素
     */
    #name;
    #switcher;

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
        this.#switcher = this.getChild('#switcher');
        this.#switcher.onchanged = () => {
            this.bubblesEvent({
                token: this.#token,
                element: this,
            });
        };
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name-token",
                "token",
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
        } else if ('default' == name) {
            this.setValue('true' == _new);
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
        this.#switcher.setChecked(value);
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    getValue() {
        return this.#switcher.check;
    }
}

CustomElementRegister(tagName, Switcher);
