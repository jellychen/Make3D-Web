/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Setter                from './v-size-setter-panel';
import Html                  from './v-size-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-size';

/**
 * 用来指定渲染的尺寸
 */
export default class RenderSize extends Element {
    /**
     * 渲染的尺寸
     */
    #w = 0;
    #h = 0;

    /**
     * 元素
     */
    #text_w;
    #text_h;
    #more;

    /**
     * 事件回调
     */
    onchange;

    /**
     * 获取
     */
    get w() {
        return this.#w;
    }

    /**
     * 获取
     */
    get h() {
        return this.#h;
    }

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
        this.#text_w = this.getChild('#w');
        this.#text_h = this.getChild('#h');
        this.#more   = this.getChild('#more');
        this.#more.onclick = event => this.#onClickMore(event);
    }

    /**
     * 
     * 设置尺寸
     * 
     * @param {*} w 
     * @param {*} h 
     */
    setSize(w, h) {
        this.#w = parseInt(w);
        this.#h = parseInt(h);
        this.#text_w.innerText = `${this.#w}`;
        this.#text_h.innerText = `${this.#h}`;
    }

    /**
     * 
     * 点击更多
     * 
     * @param {*} event 
     */
    #onClickMore(event) {
        const setter = Setter.show(this.#more);
        setter.callback = (w, h) => {
            if (isFunction(this.onchange)) {
                try {
                    this.onchange(w, h);
                } catch (e) {
                    console.error(e);
                }
                this.setSize(w, h);
            }
        };
    }
}

CustomElementRegister(tagName, RenderSize);

