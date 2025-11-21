/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-toast-warn';

/**
 * 退出的指示器
 */
export default class ToastWarn extends Element {
    /**
     * 元素
     */
    #container;
    #label;
    #cancel;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(false);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#label     = this.getChild('#label');
        this.#cancel    = this.getChild('#cancel');
        this.#cancel.onclick = event => this.#onClickCancel(event);
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Pump(this.#container);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} token 
     */
    setLabelToken(token) {
        this.#label.setToken(token);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} data 
     */
    setLabelData(data) {
        this.#label.setData(data);
    }

    /**
     * 
     * 点击取消按钮
     * 
     * @param {*} event 
     */
    #onClickCancel(event) {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, ToastWarn);
