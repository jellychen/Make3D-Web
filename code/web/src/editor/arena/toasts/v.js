/* eslint-disable no-unused-vars */

import isUndefined           from 'lodash/isUndefined';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-toasts';

/**
 * Toasts
 */
export default class Toasts extends Element {
    /**
     * 元素
     */
    #close_btn;
    #text;

    /**
     * 销毁回调
     */
    on_dismiss = () => {};

    /**
     * 是否在等待
     */
    #is_waitting_dismiss = false;
    #timer;

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
        this.#close_btn = this.getChild('#close-btn');
        this.#text      = this.getChild('#text');
        this.#close_btn.addEventListener('click', ()=> this.dismiss());
    }

    /**
     * 
     * 设置显示内容
     * 
     * @param {*} data 
     */
    setData(data) {
        this.#text.setData(data);
    }

    /**
     * 
     * 设置显示内容
     * 
     * @param {*} token 
     */
    setToken(token) {
        this.#text.setTokenKey(token);
    }

    /**
     * 
     * 延迟销毁
     * 
     * @param {*} timeout_ms 
     */
    deferDismiss(timeout_ms) {
        if (this.#is_waitting_dismiss) {
            return false;
        }
        this.#is_waitting_dismiss = true;
        this.#timer = setTimeout(() => this.dismiss(), timeout_ms);
        return true;
    }

    /**
     * 移除
     */
    remove() {
        if (!isUndefined(this.#timer)) {
            clearTimeout(this.#timer);
            this.#timer = undefined;
        }
        super.remove();
    }

    /**
     * 销毁
     */
    dismiss() {
        if (!this.parentNode) {
            return;
        }

        Animation.Remove(this, () => {
            this.on_dismiss();
        })
    }
}

CustomElementRegister(tagName, Toasts);
