/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isFunction            from 'lodash/isFunction';
import ComputePosition       from '@common/misc/compute-position';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-size-setter-panel-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-size-setter-panel';

/**
 * 设置面板
 */
export default class RenderSizeSetterPanel extends Element {
    /**
     * 回调函数
     */
    callback;

    /**
     * 元素
     */
    #content;
    #w;
    #h;
    #apply;

    /**
     * 事件
     */
    #on_dismiss = event => this.#onClickOutside(event);

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
        this.#content = this.getChild('#content');
        this.#w       = this.getChild('#w');
        this.#h       = this.getChild('#h');
        this.#apply   = this.getChild('#btn');
        this.#apply.onclick = event => this.#onClickApply(event);
        for (const child of this.#content.childNodes) {
            child.onclick = () => {
                this.#onClickSizeItem(child);
            }
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("pointerdown", this.#on_dismiss);
    }

    /**
     * 
     * 点击其他位置
     * 
     * @param {*} event 
     */
    #onClickOutside(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        } else {
            this.dismiss();
        }
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }

    /**
     * 
     * 点击
     * 
     * @param {*} element 
     */
    #onClickSizeItem(element) {
        this.dismiss();
        const attr = element.getAttribute('size');
        if (!isString(attr)) {
            return;
        }

        const [aStr, bStr] = attr.split(',');
        const a = parseInt(aStr);
        const b = parseInt(bStr);
        if (isFunction(this.callback)) {
            try {
                this.callback(a, b);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 
     * 点击应用
     * 
     * @param {*} event 
     */
    #onClickApply(event) {
        this.dismiss();
    }

    /**
     * 
     * 显示
     * 
     * @param {*} ref_element 
     * @returns 
     */
    static show(ref_element) {
        const element = new RenderSizeSetterPanel();
        document.body.appendChild(element);
        ComputePosition(ref_element, element, 'bottom', 8);
        return element;
    }
}

CustomElementRegister(tagName, RenderSizeSetterPanel);
