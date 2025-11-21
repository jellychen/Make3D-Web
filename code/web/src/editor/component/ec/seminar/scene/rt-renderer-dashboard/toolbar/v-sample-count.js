/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-sample-count-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-sample-count';

/**
 * 用来显示采样数
 */
export default class SampleCount extends Element {
    /**
     * 元素
     */
    #target;
    #current;

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
        this.#current = this.getChild('#current');
        this.#target  = this.getChild('#target');
    }

    /**
     * 
     * 设置当前的采样数
     * 
     * @param {*} target 
     * @param {*} current 
     */
    setCount(target, current) {
        this.#target.innerText  = `${target}`;
        this.#current.innerText = `${current}`;
    }
}

CustomElementRegister(tagName, SampleCount);