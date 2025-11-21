/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-light-cell-number';

/**
 * 调整数字
 */
export default class Number extends Element {
    /**
     * 元素
     */
    #container;
    #name;
    #numizer;
    #input;

    /**
     * 当前值
     */
    #value = 0;

    /**
     * 限制范围
     */
    #limit_min = undefined;
    #limit_max = undefined;

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
        this.#numizer   = this.getChild('#numizer');
        this.#input     = this.getChild('#input');
        this.#numizer.addEventListener('datachanged', (event) => {
            if (this.#value == event.data) {
                return;
            }
            this.#value = event.data;
            this.#value = this.#clamp(this.#value);
            this.#input.setValue(this.#value);
            this.#onValueChanged(this.#value);
        });

        this.#input.addEventListener('changed', (event) => {
            if (this.#value == event.data) {
                return;
            }
            this.#value = event.data;
            this.#value = this.#clamp(this.#value);
            this.#numizer.setValue(this.#value);
            this.#onValueChanged(this.#value);
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
                "min",
                "max",
                "span",
                "one-span-subdivide",
                "scale",
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
        } else if ('min' == name) {
            this.#limit_min = parseFloat(_new);
        } else if ('max' == name) {
            this.#limit_max = parseFloat(_new);
        } else if ('span' == name) {
            this.setSpan(parseFloat(_new));
        } else if ('one-span-subdivide' == name) {
            this.setOneSpanSubdivide(parseFloat(_new));
        } else if ('scale' == name) {
            this.#numizer.setValueScale(_new);
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
        return this.#value;
    }

    /**
     * 
     * 设置值
     * 
     * @param {Number} value 
     */
    setValue(value) {
        value = this.#clamp(parseFloat(value));
        if (this.#value == value) {
            return;
        }
        this.#is_setting = true;
        this.#value = value;
        this.#input  .setValue(value);
        this.#numizer.setValue(value);
        this.#is_setting = false;
    }

    /**
     * 
     * 设置跨度
     * 
     * @param {Number} value 
     */
    setSpan(value) {
        this.#is_setting = true;
        value = parseFloat(value);
        if (value > 0) {
            this.#numizer.setSpan(value);
        }
        this.#is_setting = false;
    }

    /**
     * 
     * 设置单个跨度的细分次数
     * 
     * @param {Number} subdivide 
     */
    setOneSpanSubdivide(subdivide) {
        this.#is_setting = true;
        subdivide = parseFloat(subdivide);
        if (subdivide > 0) {
            this.#numizer.setOneSpanSubdivide(subdivide);
        }
        this.#is_setting = false;
    }

    /**
     * 
     * 限制范围
     * 
     * @param {number} value 
     */
    #clamp(value) {
        value = parseFloat(value);
        if (undefined != this.#limit_min) {
            if (value <= this.#limit_min) {
                value = this.#limit_min;
            }
        }

        if (undefined != this.#limit_max) {
            if (value >= this.#limit_max) {
                value = this.#limit_max;
            }
        }

        return value;
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

CustomElementRegister(tagName, Number);
