/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import PaymentItem           from './v-payment-item';
import GotoCheckout          from './v-goto-checkout';
import Html                  from './v-payment-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-paid-membership-benefits-payment';

/**
 * 支付按钮
 */
export default class Payment extends Element {
    /**
     * 元素
     */
    #container;
    #m;             // 月
    #q;             // 季
    #y;             // 年
    #alipay;        // 支付宝
    #card;          // 信用卡
    #close;

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
        this.#container      = this.getChild('#container');
        this.#m              = this.getChild('#m');
        this.#q              = this.getChild('#q');
        this.#y              = this.getChild('#y');
        this.#alipay         = this.getChild('#alipay');
        this.#card           = this.getChild('#card');
        this.#close          = this.getChild('#close');
        this.#close.onclick  = () => this.dispose();
        this.#m.onclick      = () => this.#onClick_m();
        this.#q.onclick      = () => this.#onClick_q();
        this.#y.onclick      = () => this.#onClick_y();
        this.#alipay.onclick = () => this.#onClick_alipay();
        this.#card.onclick   = () => this.#onClick_card();
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
    }

    /**
     * 点击
     */
    #onClick_m() {
        this.#m.setSelected(true);
        this.#q.setSelected(false);
        this.#y.setSelected(false);
    }

    /**
     * 点击
     */
    #onClick_q() {
        this.#m.setSelected(false);
        this.#q.setSelected(true);
        this.#y.setSelected(false);
    }

    /**
     * 点击
     */
    #onClick_y() {
        this.#m.setSelected(false);
        this.#q.setSelected(false);
        this.#y.setSelected(true);
    }

    /**
     * 
     * 获取当前的周期
     * 
     * @returns 
     */
    #getPeriod() {
        if (this.#m.selected) return 'm';
        if (this.#q.selected) return 'q';
        if (this.#y.selected) return 'y';
    }

    /**
     * 点击支付宝
     */
    #onClick_alipay() {
        const period = this.#getPeriod();
        const goto_checkout = new GotoCheckout();
        document.body.appendChild(goto_checkout);
        goto_checkout.start('alipay', period);
        this.remove();
    }

    /**
     * 信用卡
     */
    #onClick_card() {
        const period = this.#getPeriod();
        const goto_checkout = new GotoCheckout();
        document.body.appendChild(goto_checkout);
        goto_checkout.start('card', period);
        this.remove();
    }

    /**
     * 销毁
     */
    dispose() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, Payment);
