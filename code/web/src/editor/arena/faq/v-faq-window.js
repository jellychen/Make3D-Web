/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-faq-window.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-faq-window';

/**
 * FAQ Window
 */
export default class FaqWindow extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 事件回调
     */
    #on_dismiss = event => this.#onDismiss(event);

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
        this.onclick = (event) => {
            event.stopPropagation();
        };
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("click", this.#on_dismiss, false);

        // 执行动画
        this.style.opacity = 0;
        this.style.transform = 'translateX(-20px) translateY(0px)';
        Animation.Try(
            this,
            {
                opacity: 1,
                duration: 300,
                translateX: 0, // 水平移动
                translateY: 0, // 垂直移动
                easing: 'easeOutCubic',
            });
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("click", this.#on_dismiss, false);
    }

    /**
     * 
     * 显示
     * 
     * @param {*} parent 
     */
    show(parent) {
        parent.appendChild(this);
        ComputePosition(parent, this, 'top-end', 10);
    }

    /**
     * 
     * 消失
     * 
     * @param {*} event 
     * @returns 
     */
    #onDismiss(event) {
        this.remove();
    }
}

CustomElementRegister(tagName, FaqWindow);
