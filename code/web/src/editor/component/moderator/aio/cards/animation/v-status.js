/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import TweenIcon             from './v-tween';
import Html                  from './v-status-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-status';

/**
 * 显示状态
 */
export default class Status extends Element {
    /**
     * 元素
     */

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

CustomElementRegister(tagName, Status);
