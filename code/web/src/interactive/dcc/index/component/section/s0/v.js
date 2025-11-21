/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-s0';

/**
 * s0
 */
export default class S0 extends Element {
    /**
     * 元素
     */
    #btn_try;

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
        this.#btn_try = this.getChild('#try');
        this.#btn_try.onclick = event => this.#showWorkbench(event);
    }

    /**
     * 
     * 显示
     * 
     * @param {*} event 
     */
    #showCommingSoon(event) {
        document.body.append(new CommingSoon());
    }

    /**
     * 
     * 展示
     * 
     * @param {*} event 
     */
    #showWorkbench(event) {
        window.location.href = '/editor';
    }
}

CustomElementRegister(tagName, S0);
