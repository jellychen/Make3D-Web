/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import ComputePosition       from '@common/misc/compute-position';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-hover-tips-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-introducer-hover-tips';

/**
 * Tips
 */
export default class Tips extends Element {
    /**
     * 元素
     */
    #close;
    #text;
    #text_progress;
    #last;
    #next;

    /**
     * 事件
     */
    on_close;
    on_next;
    on_last;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造函数
     */
    onCreate() {
        super.onCreate();
        this.#close         = this.getChild('#close');
        this.#text          = this.getChild('#text');
        this.#text_progress = this.getChild('#l');
        this.#last          = this.getChild('#last');
        this.#next          = this.getChild('#next');
        this.#close.onclick = () => this.#onClickClose();
        this.#last .onclick = () => this.#onClickLast ();
        this.#next .onclick = () => this.#onClickNext ();
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} text 
     */
    setText(text) {
        this.#text.setRaw(text);
    }

    /**
     * 
     * 设置值的Token
     * 
     * @param {*} token 
     */
    setTextToken(token) {
        this.#text.setToken(token);
    }

    /**
     * 
     * 更新位置
     * 
     * @param {*} reference_element 
     * @param {*} atonce 
     */
    updatePosition(reference_element, atonce = false) {
        if (atonce) {
            ComputePosition(reference_element, this, 'auto');
        } else {
            ComputePosition(reference_element, this, 'auto', 10, false, (x, y) => {
                Animation.Try(this, {
                    left    : x,
                    top     : y,
                    duration: 300,
                    easing  : 'easeOutCubic',
                });
            });
        }
    }

    /**
     * 
     * 设置当前的进度
     * 
     * @param {*} current 
     * @param {*} total 
     */
    setProgress(current, total) {
        this.#text_progress.innerText = `${current}/${total}`;
    }

    /**
     * 
     * 设置按钮状态
     * 
     * @param {*} enable 
     */
    setEnableNext(enable) {
        if (enable) {
            this.#next.style.visibility = 'visible';
        } else {
            this.#next.style.visibility = 'hidden';
        }
    }

    /**
     * 
     * 设置按钮状态
     * 
     * @param {*} enable 
     */
    setEnableLast(enable) {
        if (enable) {
            this.#last.style.visibility = 'visible';
        } else {
            this.#last.style.visibility = 'hidden';
        }
    }

    /**
     * 点击关闭
     */
    #onClickClose() {
        if (isFunction(this.on_close)) {
            this.on_close();
        }
    }

    /**
     * 点击上一个
     */
    #onClickLast() {
        if (isFunction(this.on_last)) {
            this.on_last();
        }
    }

    /**
     * 点击下一个
     */
    #onClickNext() {
        if (isFunction(this.on_next)) {
            this.on_next();
        }
    }
}

CustomElementRegister(tagName, Tips);
