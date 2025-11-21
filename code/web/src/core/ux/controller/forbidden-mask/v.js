/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-forbidden-mask';

/**
 * 全局的禁止遮罩
 */
export default class ForbiddenMask extends Element {
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

    /**
     * 
     * 设置鼠标样式
     * 
     * @param {*} style 
     */
    setCursor(style) {
        if (isString(style)) {
            this.style.cursor = style;
        }
    }
}

CustomElementRegister(tagName, ForbiddenMask);
