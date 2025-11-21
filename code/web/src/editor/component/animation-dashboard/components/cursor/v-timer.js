/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-timer-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-cursor-timer';

/**
 * 时间轴的计时器
 */
export default class CursorTimer extends Element {
    /**
     * 容器
     */
    #container;

    /**
     * 用来移除的定时器
     */
    #timer_handle;

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
        this.#container = this.getChild('#container');
    }

    /**
     * 
     * 设置
     * 
     * @param {*} time 
     */
    setTime(time) {
        time = time.toFixed(2);
        this.#container.innerText = `${time}s`;
        this.style.display = 'block';
        if (this.#timer_handle) {
            clearTimeout(this.#timer_handle);
        }
        this.#timer_handle = setTimeout(() => {
            this.style.display = 'none';
            this.#timer_handle = undefined;
        }, 1500);
    }
}

CustomElementRegister(tagName, CursorTimer);
