/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import Animation             from '@common/misc/animation.js'
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-confirmation';

/**
 * 确认
 */
export default class Confirmation extends Element {
    /**
     * 元素
     */
    #container;
    #desc;
    #confirm;
    #cancel;

    /**
     * 取消或者确认的回调
     */
    on_cancel_or_confirm;
    
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
        this.#container = this.getChild('#container');
        this.#desc      = this.getChild('#desc');
        this.#confirm   = this.getChild('#confirm');
        this.#cancel    = this.getChild('#cancel');
        this.#confirm.addEventListener('pointerdown', (event) => this.#onClickOK(event));
        this.#cancel .addEventListener('pointerdown', (event) => this.#onClickCancel(event));
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Pump(this);
    }

    /**
     * 
     * 设置窗体风格
     * 
     * black
     * glass
     * 
     * @param {string} style 
     */
    setStyle(style) {
        if (isString(style)) {
            this.#container.setAttribute('window-style', style); 
        }
    }

    /**
     * 
     * 设置显示内容
     * 
     * @param {string} data 
     */
    setDescData(data) {
        if (isString(data)) {
            this.#desc.setData(data);
        }
    }

    /**
     * 
     * 设置显示的内容
     * 
     * @param {string} token 
     */
    setDescToken(token) {
        if (isString(token)) {
            this.#desc.setToken(token);
        }
    }

    /**
     * 
     * 点击确认
     * 
     * @param {*} event 
     */
    #onClickOK(event) {
        if (isFunction(this.on_cancel_or_confirm)) {
            this.on_cancel_or_confirm(true);
        }
        Animation.Remove(this);
    }

    /**
     * 
     * 点击取消
     * 
     * @param {*} event 
     */
    #onClickCancel(event) {
        if (isFunction(this.on_cancel_or_confirm)) {
            this.on_cancel_or_confirm(false);
        }
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Confirmation);
