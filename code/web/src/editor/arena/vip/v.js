/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-vip';

/**
 * 充值VIP后的庆祝动作
 */
export default class VIP extends Element {
    /**
     * 元素
     */
    #icon;

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
        this.#icon = this.getChild('#icon');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Pump(this.#icon);
    }

    /**
     * 消除
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, VIP);