/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-congratulation-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-side-menu-subscriber-congratulation';

/**
 * 恭喜
 */
export default class Congratulation extends Element {
    /**
     * 元素
     */
    #panel;
    #close;

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
        this.#panel = this.getChild('#panel');
        this.#close = this.getChild('#close');
        this.#close.onclick = () => this.dispose();
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Pump(this.#panel);
    }

    /**
     * 显示
     */
    static show() {
        const panel = new Congratulation();
        document.body.appendChild(panel);
        return panel;
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Try(this.#panel, {
            opacity   : [1, 0],
            duration  : 300,
            easing    : 'easeOutCubic',
            onComplete: () => {
                this.remove();
            }
        });
    }
}

CustomElementRegister(tagName, Congratulation);
