/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-progress-infinite-line';

/**
 * 无限进度条, 这玩意高度不能修改
 */
export default class ProgressInfiniteLine extends Element {
    /**
     * 元素
     */
    #bar;

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
                "color"
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

        if ('color' === name) {
            this.setColor(_new);
        }
    }

    /**
     * 
     * Css Color
     * 
     * @param {String} color 
     */
    setColor(color) {
        if (isString(color)) {
            this.#bar.style.backgroundColor = color;
        }
    }
}

CustomElementRegister(tagName, ProgressInfiniteLine);
