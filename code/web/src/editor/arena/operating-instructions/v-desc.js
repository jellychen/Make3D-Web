/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-desc-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-operating-instructions-desc';

/**
 * 操作指引描述
 */
export default class OperatingInstructionsDesc extends Element {
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

CustomElementRegister(tagName, OperatingInstructionsDesc);
