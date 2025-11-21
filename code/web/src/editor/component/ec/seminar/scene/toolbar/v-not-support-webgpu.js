/* eslint-disable no-unused-vars */

import ComputePosition       from '@common/misc/compute-position';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-not-support-webgpu-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-scene-not-support-webgpu';

/**
 * WebGPU错误
 */
export default class NotSupportWebGPU extends Element {
    /**
     * 元素
     */
    #ok;

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
        this.#ok = this.getChild('#ok');
        this.#ok.onclick = event => this.dismiss();
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
     * 显示
     * 
     * @param {*} ref_element 
     */
    static show(ref_element) {
        const element = new NotSupportWebGPU();
        document.body.appendChild(element);
        ComputePosition(ref_element, element, 'bottom', 0);
    }
}

CustomElementRegister(tagName, NotSupportWebGPU);
