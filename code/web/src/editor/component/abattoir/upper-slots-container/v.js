/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-upper-slots-container';

/**
 * 嵌入
 */
export default class UpperSlotsContainer extends Element {
    /**
     * 元素
     */
    #container;
    #content;

    /**
     * 拖动
     */
    #bar;
    #bar_pointer_position = 0;

    /**
     * 获取
     */
    get content() {
        return this.#content;
    }

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
        this.#container = this.getChild('#container');
        this.#content   = this.getChild('#content');
        this.#bar       = this.getChild('#bar');
        this.#bar.onpointerdown = event => this.#onBarPointerDown(event);
    }

    /**
     * 清理
     */
    clear() {
        const children = this.#content.childNodes;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            this.#content.removeChild(child);
            if (isFunction(child.dismiss)) {
                try {
                    child.dismiss();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    /**
     * 
     * 设置可见度
     * 
     * @param {*} visible 
     */
    setVisible(visible) {
        if (visible) {
            this.style.display = 'flex';
        } else {
            this.style.display = 'none';
        }
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onBarPointerDown(event) {
        this.#bar.setPointerCapture(event.pointerId);
        this.#bar.onpointermove    = event => this.#onBarPointerMove  (event);
        this.#bar.onpointerup      = event => this.#onBarPointerUp    (event);
        this.#bar.onpointercancel  = event => this.#onBarPointerCancel(event);
        this.#bar_pointer_position = event.clientY;
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onBarPointerMove(event) {
        const offset        = event.clientY - this.#bar_pointer_position;
        const current       = this.clientHeight + offset;
        this.style.height   = `${current}px`;
        this.#bar_pointer_position = event.clientY;
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onBarPointerUp(event) {
        this.#bar.onpointermove   = undefined;
        this.#bar.onpointerup     = undefined;
        this.#bar.onpointercancel = undefined;
    }

    /**
     * 
     * 事件
     * 
     * @param {*} event 
     */
    #onBarPointerCancel(event) {
        this.#onBarPointerUp();
    }
}

CustomElementRegister(tagName, UpperSlotsContainer);
