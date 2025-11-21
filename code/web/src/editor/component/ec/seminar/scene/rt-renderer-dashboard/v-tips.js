/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tips-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-tips';

/**
 * 提示信息
 */
export default class Tips extends Element {
    /**
     * 元素
     */
    #text;
    
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化函数
     */
    onCreate() {
        super.onCreate();
        this.#text = this.getChild('#text');
    }

    /**
     * 
     * 设置显示的
     * 
     * @param {*} text 
     */
    setText(text) {
        if (isString(text)) {
            this.#text.innerText = text;
            this.style.display = 'block';
        } else {
            this.style.display = 'none';
        }
    }
}

CustomElementRegister(tagName, Tips);
