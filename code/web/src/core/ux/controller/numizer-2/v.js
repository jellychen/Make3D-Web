/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-numizer-2';

/**
 * 数值
 */
export default class Numizer2 extends Element {
    /**
     * Dom元素
     */
    #container;
    #numizer;
    #input;

    /**
     * 设置
     */
    set value(data) {
        this.setValue(data);
    }

    /**
     * 获取值
     */
    get value() {
        return this.getValue();
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
        this.#container = this.getChild('#container');
        this.#numizer   = this.getChild('#numizer');
        this.#input     = this.getChild('#input');
        this.#numizer.addEventListener('datachanged', (event)=>this.#onNumizerValueChanged(event));
        this.#input  .addEventListener('changed',     (event)=>this.#onInputValueChanged  (event));
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
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
    }

    /**
     * 获取数值
     */
    getValue() {
        return this.#numizer.value;
    }

    /**
     * 
     * 设置数值
     * 
     * @param {*} value 
     */
    setValue(value) {
        value = parseFloat(value);
        this.#input.value = value;
        this.#numizer.value = value;
    }

    /**
     * 
     * 值发生了变化
     * 
     * @param {*} event 
     */
    #onNumizerValueChanged(event) {
        const value = parseFloat(event.data);
        this.#input.value = value;
        this.dispatchUserDefineEvent('changed', { 
            data: value,
            value
        });
    }

    /**
     * 
     * 值发生了变化
     * 
     * @param {*} event 
     */
    #onInputValueChanged(event) {
        const value = parseFloat(event.value);
        this.#numizer.value = value;
        this.dispatchUserDefineEvent('datachanged', { 
            data: value,
            value
        });
    }
}

CustomElementRegister(tagName, Numizer2);