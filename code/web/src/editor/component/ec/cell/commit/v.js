/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-cell-commit';

/**
 * 提交按钮
 */
export default class Commit extends Element {
    /**
     * 元素
     */
    #button;

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
        this.#button = this.getChild('#button');
        this.#button.addEventListener('pointerdown', event => this.bubblesEvent({ token: "commit" }));
        this.#button.onclick = () => this.dispatchUserDefineEvent('click');
    }
}

CustomElementRegister(tagName, Commit);
