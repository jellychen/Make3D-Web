/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-range-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-controller-range';

/**
 * 时间区域
 */
export default class Range extends Element {
    /**
     * 元素
     */
    #start;
    #end;

    /**
     * 构造函数
     */
    constructor() {
        super();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#start = this.getChild('#start');
        this.#end   = this.getChild('#end');
    }

    /**
     * 
     * 设置
     * 
     * @param {*} start 
     * @param {*} end 
     */
    set(start, end) {
        this.#start.innerText = `${start.toFixed(2)}s`;
        this.#end  .innerText = `${end  .toFixed(2)}s`;
    }
}

CustomElementRegister(tagName, Range);
