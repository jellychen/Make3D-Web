/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import FaqWindow             from './v-faq-window';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-faq';

/**
 * FAQ
 */
export default class Faq extends Element {
    /**
     * sub - window
     */
    #sub_window;

    /**
     * 元素
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
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#container.onclick = (event) => {
            this.#onClick();
            event.stopPropagation();
        };
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * 点击
     */
    #onClick() {
        if (!this.#sub_window) {
            this.#sub_window = new FaqWindow();
        }
        this.#sub_window.remove();
        this.#sub_window.show(this.#container);
    }
}

CustomElementRegister(tagName, Faq);
