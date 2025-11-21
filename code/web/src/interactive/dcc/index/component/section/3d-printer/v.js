/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Image0                from '@assets/images/picture/3d-printer.webp';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-3d-printer';

/**
 * s1
 */
export default class Printer3D extends Element {
    /**
     * 元素
     */
    #img;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#img = this.getChild('#img');
        this.#img.setSrc(Image0);
    }
}

CustomElementRegister(tagName, Printer3D);
