/* eslint-disable no-unused-vars */

import isNumber              from 'lodash/isNumber';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-abattoir-toast';

/**
 * 用来显示一些提示
 */
export default class AbattoirToast extends Element {
    /**
     * 元素
     */
    #container;
    #text;

    /**
     * 销毁的定时器
     */
    #remove_timer = null;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 初始化
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#text = this.getChild('#text');
    }

    /**
     * 
     * @param {string} data 
     */
    setTextData(data) {
        this.#text.setData(data);
    }

    /**
     * 
     * 放置
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {boolean} align_center 
     */
    place(x, y, align_center = false) {
        if (!isNumber(x)) {
            x = 0;
        }

        if (!isNumber(y)) {
            y = 0;
        }

        if (align_center) {
            x = x - this.clientWidth  * 0.5;
            y = y - this.clientHeight * 0.5;
        }

        this.style.left = `${x}px`;
        this.style.top  = `${y}px`;
    }

    /**
     * 移除
     */
    dismiss() {
        // 首先移除之前的定时器
        if (this.#remove_timer) {
            clearTimeout(this.#remove_timer);
            this.#remove_timer = null;
        }

        // 移除
        this.remove();
    }

    /**
     * 
     * 延迟移除
     * 
     * @param {Number} timeout 
     */
    deferDismiss(timeout = 1500) {
        if (!isNumber(timeout)) {
            timeout = 1500;
        }

        // 首先移除之前的定时器
        if (this.#remove_timer) {
            clearTimeout(this.#remove_timer);
            this.#remove_timer = null;
        }

        // 设置定时器
        this.#remove_timer = setTimeout(() => {
            this.#remove_timer = null;
            this.dismiss();
        }, timeout);
    }
}

CustomElementRegister(tagName, AbattoirToast);
