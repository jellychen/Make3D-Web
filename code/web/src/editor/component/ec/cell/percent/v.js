/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-cell-percent';

/**
 * 调整数字
 */
export default class Percent extends Element {
    /**
     * 元素
     */
    #container;
    #name;
    #slider;
    #input;

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
        this.#slider    = this.getChild('#slider');
        this.#input     = this.getChild('#input');
        this.#slider.addEventListener('changed', event => {
            this.#input.setValue(parseInt(event.percent * 100));
            this.#onValueChanged(event.percent);
        })

        this.#input.addEventListener('changed', event => {
            let data = event.data;
            if (data < 0  ) data = 0;
            if (data > 100) data = 100;
            this.#input.setValue(parseInt(data));
            data = data / 100;
            this.#slider.setPercent(data);
            this.#onValueChanged(data);
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
            this.setValue(parseFloat(_new));
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
        return this.#slider.getPercent();
    }

    /**
     * 
     * 设置值 0 - 1
     * 
     * @param {Number} value 
     */
    setValue(value) {
        this.#is_setting = true;
        value = parseFloat(value);
        if (value < 0  ) value = 0;
        if (value > 100) value = 1;
        this.#slider.setPercent(value);
        this.#input.setValue(parseInt(value * 100));
        this.#is_setting = false;
    }

    /**
     * 
     * 通知值发生了变化 0 - 1
     * 
     * @param {number} value 
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

CustomElementRegister(tagName, Percent);
