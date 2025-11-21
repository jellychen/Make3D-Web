/* eslint-disable no-unused-vars */

import Html2canvas           from 'html2canvas';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-setter';

/**
 * 设置
 */
export default class Setter extends Element {
    /**
     * 元素
     */
    #hidden;

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
        this.#hidden = this.getChild('#hidden');
        this.#hidden.onclick = () => this.#hide();
    }

    /**
     * 保存成图
     */
    #hide() {
        const old_display = this.style.display;
        this.style.display = 'none';
    }
}

CustomElementRegister(tagName, Setter);
