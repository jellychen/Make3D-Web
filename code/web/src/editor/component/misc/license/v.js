/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ServeLicense          from '@assets/license/serve.license';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-license';

/**
 * 服务协议
 */
export default class LicenseContent extends Element {
    /**
     * 内容
     */
    #content;

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
        this.#content = this.getChild('#input');
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 加载数据
        fetch(ServeLicense)
            .then(response => {
                if (!response.ok) {
                    return;
                }
                return response.text();
            })
            .then(txt => {
                this.#content.value = txt;
            })
            .catch(error => {
                console.error(error);
            });
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
    }
}

CustomElementRegister(tagName, LicenseContent);
