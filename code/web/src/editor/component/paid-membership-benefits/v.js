/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import                            './v-benefit-item';
import WaitforPaid           from './v-waitfor-paid';
import Payment               from './v-payment';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-paid-membership-benefits';

/**
 * 付费会员权益
 */
export default class PaidMembershipBenefits extends Element {
    /**
     * 元素
     */
    #container;
    #animation;
    #subscribe;

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
        this.getChild('#close-btn').onclick = () => this.dismiss();
        this.#container         = this.getChild('#container');
        this.#animation         = this.getChild('#animation');
        this.#subscribe         = this.getChild('#subscribe');
        this.#subscribe.onclick = () => this.#onClickSubscribe();
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

    // /**
    //  * 点击按月付费
    //  */
    // #onClickMonthly() {
    //     Animation.Remove(this, () => WaitforPaid.Show());
    // }

    /**
     * 点击订阅
     */
    #onClickSubscribe() {
        this.dismiss();
        const payment = new Payment();
        document.body.appendChild(payment);
    }

    /**
     * 销毁
     */
    dismiss() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, PaidMembershipBenefits);
