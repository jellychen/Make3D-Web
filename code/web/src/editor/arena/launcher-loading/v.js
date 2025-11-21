/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-launcher-loading';

/**
 * 加载器
 */
export default class LauncherLoading extends Element {
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
        this.setEnableCustomizeMenu(true);
    }

    /**
     * 销毁
     */
    dispose() {
        this.remove();
    }
}

CustomElementRegister(tagName, LauncherLoading);
