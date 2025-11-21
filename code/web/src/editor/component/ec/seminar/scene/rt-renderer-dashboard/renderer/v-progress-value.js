/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-progress-value-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-progress-value';

/**
 * 用来显示 Pipeline 进度
 */
export default class ProgressValue extends Element {
    /**
     * container
     */
    #container;

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
    }

    /**
     * 
     * 设置百分比
     * 
     * @param {Number} percent 
     */
    setPercent(percent) {
        percent = percent * 100;
        percent = percent.toFixed(2);
        this.#container.innerText = `${percent}%`;
    }
}

CustomElementRegister(tagName, ProgressValue);
