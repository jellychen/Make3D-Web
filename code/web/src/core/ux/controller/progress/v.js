/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-progress';

/**
 * 进度条
 */
export default class Progress extends Element {
    /**
     * 内部元素
     */
    #bar;
    #bar_progress_value = 0.0;

    /**
     * 
     * 设置值
     * 
     * @param {Number} data
     */
    set value(data) {
        this.setValue(parseFloat(data));
    }

    /**
     * 获取值
     */
    get value() {
        return this.#bar_progress_value;
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
        this.#bar = this.getChild('#bar');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "value"
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

        if ('value' == name) {
            this.setValue(Number(_new));
        }
    }

    /**
     * 
     * @param {Number} value 
     */
    setValue(value) {
        value = Math.clamp(parseFloat(value), 0.0, 1.0);
        if (this.#bar_progress_value === value) {
            return;
        }
        this.#bar_progress_value = value;
        this.#bar.style.width = `${value * 100}%`;
    }
}

CustomElementRegister(tagName, Progress);
