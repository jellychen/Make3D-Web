/* eslint-disable no-unused-vars */

import GlobalBroadcastChannel from '@common/global-broadcast-channel';
import Animation              from '@common/misc/animation';
import Fireworks              from '@common/misc/fireworks';
import CustomElementRegister  from '@ux/base/custom-element-register';
import Element                from '@ux/base/element';
import ElementDomCreator      from '@ux/base/element-dom-creator';
import Html                   from './v-waitfor-paid-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-waitfor-paid';

/**
 * 等待支付
 */
export default class WaitforPaid extends Element {
    /**
     * 元素
     */
    #container;
    #close;

    /**
     * 事件回调
     */
    #on_vip_benefits_changed = () => this.#onVipBenefitsChanged();

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(true);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container     = this.getChild('#container');
        this.#close         = this.getChild('#close');
        this.#close.onclick = event => this.#onClickClose(event);
    }

    /**
     * 挂接到DOM上的回调
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Try(
            this.#container, 
            {
                translateY: [-60, 0],
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutCubic',
            });
        GlobalBroadcastChannel.addEventListener(
            'refresh-vip', this.#on_vip_benefits_changed);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        GlobalBroadcastChannel.removeEventListener(
            'refresh-vip', this.#on_vip_benefits_changed);
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }

    /**
     * 
     * 点击了关闭
     * 
     * @param {*} event 
     */
    #onClickClose(event) {
        this.dismiss();
    }

    /**
     * 会员权益发生了变化
     */
    #onVipBenefitsChanged() {
        this.dismiss();
    }

    /**
     * 显示
     */
    static Show() {
        const view = new WaitforPaid();
        document.body.appendChild(view);
        return view;
    }
}

CustomElementRegister(tagName, WaitforPaid);
