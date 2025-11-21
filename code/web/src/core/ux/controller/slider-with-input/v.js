/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-slider-with-input';

/**
 * 拖拉组件
 */
export default class SliderWithInput extends Element {
    /**
     * 元素
     */
    #container;
    #slider;
    #input;

    /**
     * 当前的值
     */
    #value = 0;

    /**
     * 范围
     */
    #range_min = 0;
    #range_max = 100;

    /**
     * 获取
     */
    get value() {
        return this.#value;
    }

    /**
     * 获取
     */
    get min() {
        return this.#range_min;
    }

    /**
     * 获取
     */
    get max() {
        return this.#range_max;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造函数
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#slider    = this.getChild('#slider');
        this.#input     = this.getChild('#input');
        this.#slider.tips_str_convert = (percent) => {
            const range = this.#range_max - this.#range_min;
            return `${(percent * range + this.#range_min).toFixed(0)}`;
        };
        this.#slider.addEventListener('changed', (event) => this.#onSliderChanged(event));
        this.#input .addEventListener('changed', (event) => this.#onInputChanged (event));
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                'value',
                'max',
                'min',
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

        if ('value' == name) {
            this.setValue(parseFloat(_new));
        } else if ('min' == name) {
            this.setRangeMin(parseFloat(_new));
        } else if ('max' == name) {
            this.setRangeMax(parseFloat(_new));
        }
    }

    /**
     * 
     * 设置值
     * 
     * @param {Number} value 
     */
    setValue(value) {
        const v = Math.clamp(parseFloat(value), this.#range_min, this.#range_max);
        if (this.#value != v) {
            this.#value = v;
            this.#input.value = this.#value;
            this.#slider.percent = (this.#value - this.#range_min) / (this.#range_max - this.#range_min);
        }
    }

    /**
     * 
     * 设置范围
     * 
     * @param {Number} value 
     */
    setRangeMax(value) {
        const v = parseFloat(value);
        if (this.#range_max != v) {
            this.#range_max = v;
            this.setValue(this.#value);
        }
    }

    /**
     * 
     * 设置范围
     * 
     * @param {Number} value 
     */
    setRangeMin(value) {
        const v = parseFloat(value);
        if (this.#range_min != v) {
            this.#range_min = v;
            this.setValue(this.#value);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} event 
     */
    #onSliderChanged(event) {
        const percent = event.percent;
        const range = this.#range_max - this.#range_min;
        const v = range * percent + this.#range_min;
        if (this.#value != v) {
            this.setValue(v);
            this.dispatchUserDefineEvent('changed', { 
                data: this.#value
            });
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} event 
     */
    #onInputChanged(event) {
        const v = parseFloat(event.data);
        if (this.#value != v) {
            this.setValue(v);
            this.dispatchUserDefineEvent('changed', { 
                data: this.#value
            });
        }
    }
}

CustomElementRegister(tagName, SliderWithInput);
