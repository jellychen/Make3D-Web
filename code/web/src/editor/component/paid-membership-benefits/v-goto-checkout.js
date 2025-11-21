/* eslint-disable no-unused-vars */

import Axios                 from 'axios';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import DaoUser               from '@editor/dao/model/user';
import Html                  from './v-goto-checkout-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-paid-membership-goto-checkout';

/**
 * 获取收银台然后跳转
 */
export default class GotoCheckout extends Element {
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
    }

    /**
     * 
     * 启动
     * 
     * @param {*} channel card/alipay
     * @param {*} period  m / q / y 
     */
    start(channel, period) {
        const eml = DaoUser.email;
        const uid = DaoUser.uid;

        let cls = 0;
        switch (period) {
        case 'm':
            cls = 1;
            break;

        case 'q':
            cls = 3;
            break;

        case 'y':
            cls = 12;
            break;
        }

        if ('card' === channel) {
            Axios.get("//api.make3d.online/v1/payment/creem/checkout-session", {
                params: {
                    uid,
                    eml,
                    cls,
                }
            }).then(response => {
                try {
                    this.#onSuccess(response.data.content.url);
                } catch(e) {
                    this.#onError();
                }
            }).catch(error => {
                this.#onError();
            });
        } else if ('alipay' === channel) {
            Axios.get("//api.make3d.online/v1/payment/zpay/checkout-session", {
                params: {
                    uid,
                    eml,
                    cls,
                }
            }).then(response => {
                try {
                    this.#onSuccess(response.data.content.url);
                } catch(e) {
                    this.#onError();
                }
            }).catch(error => {
                this.#onError();
            });
        }
    }

    /**
     * 失败
     */
    #onError() {
        this.dispose();
    }

    /**
     * 
     * 成功
     * 
     * @param {*} jump_url 
     */
    #onSuccess(jump_url) {
        this.dispose();
        window.open(jump_url, '_blank');
    }

    /**
     * 销毁
     */
    dispose() {
        this.remove();
    }
}

CustomElementRegister(tagName, GotoCheckout);
