/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-shader-layer-none';

/**
 * 空
 */
export default class None extends Element {
    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 
     * 设置可见性
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

CustomElementRegister(tagName, None);

