/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-classes-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-subdivision-classes';

/**
 * 细分类型
 */
export default class Classes extends Element {
    /**
     * 元素
     */
    #container;
    #selector;

    /**
     * data
     */
    #data = "cc";

    /**
     * 获取
     */
    get data() {
        return this.#data;
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
        this.#selector  = this.getChild('#selector');
        this.#selector.addEventListener('changed', event => {
            this.#data = event.data;
            this.#onValueChanged(event.data);
        });
    }

    /**
     * 
     * 接受到值发生了变化
     * 
     * @param {*} data 
     */
    #onValueChanged(data) {
        if (isString(data)) {
            this.bubblesEvent({
                data
            });
        }
    }
}

CustomElementRegister(tagName, Classes);
