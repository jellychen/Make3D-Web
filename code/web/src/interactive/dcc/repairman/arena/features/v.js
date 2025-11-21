/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-features';

/**
 * 功能性
 */
export default class Features extends Element {
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
    }
}

CustomElementRegister(tagName, Features);
