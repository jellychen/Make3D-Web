/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-material-notice';

/**
 * 提示
 */
export default class Notice extends Element {
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
     * 显示可见性
     * 
     * @param {*} visible 
     */
    setVisible(visible) {
        if (visible) {
            this.style.display = 'flex';
        } else {
            this.style.display = 'none';
        }
    }
}

CustomElementRegister(tagName, Notice);
