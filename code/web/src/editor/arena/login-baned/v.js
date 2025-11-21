/* eslint-disable no-unused-vars */

import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-login-baned';

/**
 * 账户被baned
 */
export default class LoginBaned extends Element {
    /**
     * 元素
     */
    #container;
    #ok;

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
        this.#container  = this.getChild('#container');
        this.#ok         = this.getChild('#ok');
        this.#ok.onclick = () => this.#onClickOK();
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();
        Animation.Pump(this.#container);
    }

    /**
     * 点击了 OK
     */
    #onClickOK() {
        Animation.Remove(this);
    }
}

CustomElementRegister(tagName, LoginBaned);
