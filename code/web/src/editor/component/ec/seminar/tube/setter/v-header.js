/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-header-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-nav-toolbar-setter-header';

/**
 * 额头
 */
export default class Header extends Element {
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }
}

CustomElementRegister(tagName, Header);
