/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-progress-bar-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-progress-bar';

/**
 * 用来显示进度条
 */
export default class ProgressBar extends Element {
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
     * 构造函数
     */
    onCreate() {
        super.onCreate();
        this.#bar = this.getChild('#bar');
    }

    /**
     * 
     * 设置百分比
     * 
     * @param {Number} percent 
     */
    setPercent(percent) {
        percent = percent * 100;
        this.#bar.style.width = `${percent}%`;
    }
}

CustomElementRegister(tagName, ProgressBar);
