/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import GlobalScope           from '@common/global-scope';
import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-vip-supervisor';

/**
 * VIP监督员
 */
export default class VipSupervisor extends Element {
    /**
     * 界面元素
     */
    #cancel;
    #subscriber;

    /**
     * 事件回调
     */
    #on_dismiss = (event) => this.#onDismiss(event);

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
        this.#cancel             = this.getChild('#cancel');
        this.#subscriber         = this.getChild('#subscriber');
        this.#cancel.onclick     = event => this.#onClickCancel(event);
        this.#subscriber.onclick = event => this.#onClickSubscriber(event);
    }

    /**
     * 
     * 动态摆放
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    place(reference_element, placement = "auto", offset = 0) {
        if (isString(placement) && isNumber(offset)) {
            if (reference_element) {
                ComputePosition(reference_element, this, placement, offset);
            }
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("pointerdown", this.#on_dismiss);
        Animation.FadeIn(this);
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
     * 点击取消按钮
     * 
     * @param {*} event 
     */
    #onClickCancel(event) {
        this.dismiss();
    }

    /**
     * 
     * 点击订阅按钮
     * 
     * @param {*} event 
     */
    #onClickSubscriber(event) {
        if (isFunction(GlobalScope.showVipSubscriber)) {
            try {
                GlobalScope.showVipSubscriber();
            } catch (e) {
                console.error(e);
            }
        }
        this.dismiss();
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }

    /**
     * 
     * 点击其他地方, 菜单消失
     * 
     * @param {*} event 
     */
    #onDismiss(event) {
        const target = event.target;
        if (this == target || this.contains(target)) {
            return;
        }
        
        // 移除
        this.dismiss();
    }
}

CustomElementRegister(tagName, VipSupervisor);
