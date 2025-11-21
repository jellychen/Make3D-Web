/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-price-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-paid-membership-benefits-price';

/**
 * 价格
 */
export default class Price extends Element {
    /**
     * 元素
     */
    #container;

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
        this.#container = this.getChild('#container');
    }
}

CustomElementRegister(tagName, Price);
