/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-marker-delete-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-animation-dashboard-keyframe-marker-delete';

/**
 * 关闭按钮
 */
export default class Delete extends Element {
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
    }
}

CustomElementRegister(tagName, Delete);
