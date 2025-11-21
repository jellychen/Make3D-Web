/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-integer';

/**
 * 整数编辑器
 */
export default class Integer extends Element {
    /**
     * 元素
     */
    #text;
    #btn_l;
    #btn_r;

    /**
     * 范围
     */
    #range_min = undefined;
    #range_max = undefined;

    /**
     * 值
     */
    #value = 0;

    /**
     * 回调函数
     */
    on_value_changed;

    /**
     * 获取
     */
    get value() {
        return this.#value;
    }

    /**
     * 获取
     */
    set value(data) {
        this.setValue(data);
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#text  = this.getChild('#text');
        this.#btn_l = this.getChild('#l');
        this.#btn_r = this.getChild('#r');
        this.#btn_l.addEventListener('pointerdown', (event) => this.decr());
        this.#btn_r.addEventListener('pointerdown', (event) => this.incr());
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "min", 
                "max",
                "value",
            ]);
        }
        return this.attributes;
    }

    /**
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

        if ('min' == name) {
            this.#range_min = parseInt(_new);
        } else if ('max' == name) {
            this.#range_max = parseInt(_new);
        } else if ('value' == name) {
            this.setValue(_new);
        }
    }

    /**
     * 
     * 减少值
     * 
     * @param {*} value 
     * @returns 
     */
    #clamp(value) {
        value = parseInt(value);
        if (undefined != this.#range_min) {
            if (value < this.#range_min) {
                value = this.#range_min;
            }
        }

        if (undefined != this.#range_max) {
            if (value > this.#range_max) {
                value = this.#range_max;
            }
        }
        return value;
    }

    /**
     * 更新文本
     */
    #updateText() {
        this.#text.setData('' + this.#value);
    }

    /**
     * 更新按钮
     */
    #updataBtn() {
        if (this.#value <= this.#range_min) {
            this.#btn_l.setAttribute('enable', 'false');
        } else {
            this.#btn_l.setAttribute('enable', 'true');
        }

        if (this.#value >= this.#range_max) {
            this.#btn_r.setAttribute('enable', 'false');
        } else {
            this.#btn_r.setAttribute('enable', 'true');
        }
    }

    /**
     * 
     * 设置范围
     * 
     * @param {*} value 
     */
    setRangeMin(value) {
        this.#range_min = parseInt(value);
        this.#value = this.#clamp(this.#value);
        this.#updateText();
        this.#updataBtn();
    }

    /**
     * 
     * 设置范围
     * 
     * @param {*} value 
     */
    setRangeMax(value) {
        this.#range_max = parseInt(value);
        this.#value = this.#clamp(this.#value);
        this.#updateText();
        this.#updataBtn();
    }

    /**
     * 
     * 设置范围
     * 
     * @param {*} min 
     * @param {*} max 
     */
    setRange(min, max) {
        this.#range_min = parseInt(min);
        this.#range_max = parseInt(max);
    }

    /**
     * 增加值
     */
    incr() {
        const value = this.#clamp(this.#value + 1);
        if (this.#value === value) {
            return;
        }
        this.#value = value;
        this.#updateText();
        this.#updataBtn();

        // 发送事件
        this.dispatchUserDefineEvent('changed', {
            value: this.#value
        });

        if (isFunction(this.on_value_changed)) {
            this.on_value_changed(this.#value);
        }
    }

    /**
     * 减少
     */
    decr() {
        const value = this.#clamp(this.#value - 1);
        if (this.#value === value) {
            return;
        }
        this.#value = value;
        this.#updateText();
        this.#updataBtn();

        // 发送事件
        this.dispatchUserDefineEvent('changed', {
            value: this.#value
        });

        if (isFunction(this.on_value_changed)) {
            this.on_value_changed(this.#value);
        }
    }

    /**
     * 
     * 获取当前的Value
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
     * @param {*} value 
     */
    setValue(value) {
        value = parseInt(value);
        value = this.#clamp(value);
        if (this.#value === value) {
            return;
        }

        this.#value = value;
        this.#updateText();
        this.#updataBtn();
    }
}

CustomElementRegister(tagName, Integer);
