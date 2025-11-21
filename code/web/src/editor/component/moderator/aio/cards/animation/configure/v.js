/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import TweenSelector         from '../v-tween-selector';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-ani-configure';

/**
 * 动画配置器
 */
export default class Configure extends Element {
    /**
     * 事件回调
     */
    #on_dismiss       = event => this.#onDismiss     (event);
    #on_window_resize = event => this.#onWindowResize(event);

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
    }

    /**
     * 当UI首次添加到DOM执行
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
        window.addEventListener("resize", this.#on_window_resize);
    }

    /**
     * 从Dom中移除
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
        window.removeEventListener("resize", this.#on_window_resize);
    }

    /**
     * 
     * 移除
     * 
     * @param {*} event 
     * @returns 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        } else {
            Animation.Remove(this);
        }
    }

    /**
     * 
     * 窗体
     * 
     * @param {*} event 
     */
    #onWindowResize(event) {
        this.remove();
    }
}

CustomElementRegister(tagName, Configure);
