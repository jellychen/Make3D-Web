/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
import                            './v-header';
import SectionEditor         from '../section-editor/v';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-tube-setter';

/**
 * 设置面板
 */
export default class Setter extends Element {
    /**
     * host
     */
    #host;

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super(tagName);
        this.#host = host;
        this.createContentFromTpl(tpl);
    }
}

CustomElementRegister(tagName, Setter);
