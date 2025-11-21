/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-cell-switcher';

/**
 * 开关
 */
export default class Switcher extends Element {
    /**
     * 元素
     */
    #container;
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
        this.#container = this.getChild('#container');
        this.#name      = this.getChild('#name');
        this.#switcher  = this.getChild('#switcher');
        this.#switcher.addEventListener('changed', event => this.#onValueChanged());

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
            this.setChecked(_new == true);
        }
    }

    /**
     * 
     * 设置令牌
     * 
     * @param {string} token 
     */
    setToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#token = token;
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#name.setToken(token);
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    isChecked() {
        return this.#switcher.checked;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} checked 
     */
    setChecked(checked) {
        this.#switcher.checked = checked;
    }

    /**
     * 值发生变化
     */
    #onValueChanged() {
        this.bubblesEvent({
            token: this.#token,
            value: this.isChecked(),
        });
    }
}

CustomElementRegister(tagName, Switcher);
