/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-svg-extrude-editor-number';

/**
 * 调整数字
 */
export default class Number extends Element {
    /**
     * 元素
     */
    #name;
    #slider;
    #input;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 设置Range
     */
    #range_start = 0;
    #range_end = 100;

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
        this.#slider = this.getChild('#slider');
        this.#slider.addEventListener('changed', ()=> this.#onValueChanged());
        this.#slider.tips_str_convert = (percent) => {
            percent = (this.#range_end - this.#range_start) * percent + this.#range_start;
            percent = percent.toFixed(2);
            return '' + percent;
        };
        this.#input = this.getChild('#input');
        this.#input.ondatachanged = (value) => {
            let percent = (value - this.#range_start) / (this.#range_end - this.#range_start);
            if (percent < 0) percent = 0;
            if (percent > 1) percent = 1;
            this.#slider.setPercent(percent);
            this.#onValueChanged();
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
            this.#range_start = parseFloat(_new);
            this.#input.min = this.#range_start;
        } else if ('range-end' == name) {
            this.#range_end = parseFloat(_new);
            this.#input.max = this.#range_end;
        } else if ('default' == name) {
            this.setValue(parseFloat(_new));
        }
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} value 
     */
    setValue(value) {
        value = parseFloat(value);
        if (value < this.#range_start) value = this.#range_start;
        if (value > this.#range_end)   value = this.#range_end;
        this.#input.value = value;
        let percent = (value - this.#range_start) / this.getRangeLength();
        this.#slider.setPercent(percent);
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    getValue() {
        let percent = this.#slider.getPercent();
        return this.getRangeLength() * percent + this.#range_start;
    }

    /**
     * 
     * 设置范围
     * 
     * @param {number} start 
     * @param {number} end 
     */
    setRange(start, end) {
        this.#range_start = start;
        this.#range_end = end;
        this.#input.min = start;
        this.#input.max = end;
    }

    /**
     * 
     * @returns 
     */
    getRangeLength() {
        return this.#range_end - this.#range_start;
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
     * 值发生变化
     */
    #onValueChanged() {
        this.#input.value = this.getValue();
        this.bubblesEvent({
            token: this.#token,
            element: this,
        });
    }
}

CustomElementRegister(tagName, Number);
