/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import PrivacyPolicy         from './v-privacy-policy';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-footer';

/**
 * 页脚
 */
export default class Footer extends Element {
    /**
     * 元素
     */
    #btn_privacy_policy;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#btn_privacy_policy = this.getChild('#privacy-policy');
        this.#btn_privacy_policy.onclick = event => this.#onClickPrivacyPolicy(event);
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClickPrivacyPolicy(event) {
        (new PrivacyPolicy()).show();
    }
}

CustomElementRegister(tagName, Footer);
