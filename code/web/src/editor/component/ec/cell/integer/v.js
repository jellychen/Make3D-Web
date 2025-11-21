/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-cell-integer';

/**
 * 整数
 */
export default class Integer extends Element {
    /**
     * 元素
     */
    #container;
    #name;
    #integer;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 正在设置
     */
    #is_setting = false;

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
        this.#integer   = this.getChild('#number');
        this.#integer.addEventListener('changed', event => this.#onValueChanged(event.value));
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
                "min",
                "max",
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
            this.setValue(parseInt(_new));
        } else if ('min' == name) {
            this.#integer.setRangeMin(_new);
        } else if ('max' == name) {
            this.#integer.setRangeMax(_new);
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
    getValue() {
        return this.#integer.getValue();
    }

    /**
     * 
     * 设置值
     * 
     * @param {Number} value 
     */
    setValue(value) {
        this.#is_setting = true;
        this.#integer.setValue(value);
        this.#is_setting = false;
    }

    /**
     * 值发生了变化
     */
    #onValueChanged(value) {
        if (this.#is_setting) {
            return;
        }

        this.bubblesEvent({
            token: this.#token,
            value: value,
        });
    }
}

CustomElementRegister(tagName, Integer);
