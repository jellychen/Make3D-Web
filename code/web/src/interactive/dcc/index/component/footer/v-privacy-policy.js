/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-privacy-policy-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-privacy-policy';

/**
 * 显示隐私政策
 */
export default class PrivacyPolicy extends Element {
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
        this.getChild('#close').onclick = () => this.remove();
    }

    /**
     * 显示
     */
    show() {
        document.body.append(this);
    }
}

CustomElementRegister(tagName, PrivacyPolicy);
