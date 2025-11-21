/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isInteger             from 'lodash/isInteger';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-toast';

/**
 * Toast
 */
export default class Toast extends Element {
    /**
     * 元素
     */
    #container;
    #close;
    #text;

    /**
     * 事件回调
     */
    #on_close_click;

    /**
     * 关闭的定时器
     */
    #close_timer;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.#on_close_click = () => this.#onClose();
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#close     = this.getChild('#close');
        this.#text      = this.getChild('#text');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        this.#close.addEventListener('click', this.#on_close_click);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.#close.removeEventListener('click', this.#on_close_click);
    }

    /**
     * 
     * 设置类型 default / success / fail
     * 
     * @param {String} type 
     */
    setType(type) {
        if (isString(type)) {
            return;
        }

        if ('success' === type || 'info' === type) {
            this.#container.setAttribute('type', 'success');
        } else if ('fail' === type || 'error' == type) {
            this.#container.setAttribute('type', 'fail');
        } else if ('warn' === type) {
            this.#container.setAttribute('type', 'warn');
        } else {
            this.#container.setAttribute('type', 'info');
        }
    }

    /**
     * 
     * 设置显示的位置
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    setLocation(x, y) {
        this.style.position = 'absolute';
        this.style.left = `${x}px`;
        this.style.top  = `${y}px`;
        this.#container.setAttribute('location', 'none');
    }

    /**
     * 
     * 设置停靠的位置
     *  0 - 9
     * 
     * top-left|left-top            0
     * top-center                   1
     * top-right|right-top          2
     * left-center                  3
     * center                       4
     * right-center                 5
     * bottom-left|left-bottom      6
     * bottom-center                7
     * right-bottom|bottom-right    8
     * 
     * @param {number|string} dock 
     */
    setLocationDock(dock) {
        if (isInteger(dock) || isString(dock)) {
            this.#container.setAttribute('location', `${dock}`);
        }
    }

    /**
     * 原生文本数据
     */
    setContentRaw(data) {
        if (isString(data)) {
            this.#text.setRaw(data);
        }
    }

    /**
     * 文本数据的Token
     */
    setContentDataTokenKey(key) {
        if (isString(key)) {
            this.#text.setTokenKey(key);
        }
    }

    /**
     * 
     * 关闭
     * 
     * @param {boolean} animation 
     */
    close(animation = false) {
        this.resetDeferClose();
        if (true === animation) {
            this.#onClose();
        } else {
            this.remove();
        }
    }

    /**
     * 
     * 定时延迟删除自己
     * 
     * @param {number} timeout_ms 
     * @param {boolean} animation 
     */
    deferClose(timeout_ms, animation = true) {
        if (isNumber(timeout_ms)) {
            this.resetDeferClose();
            this.#close_timer = setTimeout(()=> {
                this.close(true === animation);
            }, timeout_ms);
        }
    }

    /**
     * 清楚延迟关闭
     */
    resetDeferClose() {
        if (this.#close_timer) {
            clearTimeout(this.#close_timer);
            this.#close_timer = undefined;
        }
    }

    /**
     * 关闭回调
     */
    #onClose() {
        this.resetDeferClose();
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Toast);
