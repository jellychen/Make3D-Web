/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Image0                from '@assets/images/picture/image-svg-mesh.webp';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-svg';

/**
 * svg
 */
export default class SVG extends Element {
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

CustomElementRegister(tagName, SVG);
