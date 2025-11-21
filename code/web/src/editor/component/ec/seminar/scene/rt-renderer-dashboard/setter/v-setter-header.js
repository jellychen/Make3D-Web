/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-setter-header-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-rt-renderder-dashboard-setter-header';

/**
 * SceneModal 默认的头部
 */
export default class Header extends Element {
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
}

CustomElementRegister(tagName, Header);
