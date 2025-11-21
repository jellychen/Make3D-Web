/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-close-alert-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-close-alert';

/**
 * 退出的指示器
 */
export default class CloseAlert extends Element {
    /**
     * 元素
     */
    #container;
    #btn_done;
    #btn_cancel;

    /**
     * 事件回调
     */
    onclick_close;

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
        this.#container  = this.getChild('#container');
        this.#btn_done   = this.getChild('#done');
        this.#btn_cancel = this.getChild('#cancel');
        this.#btn_done.onclick   = event => this.#onClickDone(event);
        this.#btn_cancel.onclick = event => this.#onClickCancel(event);
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
     * 点击执行的按钮
     * 
     * @param {*} event 
     */
    #onClickDone(event) {
        if (isFunction(this.onclick_close)) {
            try {
                this.onclick_close();
            } catch (e) {
                console.error(e);
            }
        }
        this.remove();
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

CustomElementRegister(tagName, CloseAlert);
