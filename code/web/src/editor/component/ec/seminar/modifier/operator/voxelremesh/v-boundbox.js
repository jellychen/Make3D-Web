/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-boundbox-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-voxelremesh-boundbox';

/**
 * 包围盒
 */
export default class Boundbox extends Element {
    /**
     * 元素
     */
    #container;
    #text;

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
        this.#container = this.getChild('#container');
        this.#text      = this.getChild('#text');
    }

    /**
     * 
     * 设置包围盒
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     */
    setBoundbox(x, y, z) {
        this.#text.innerText = `BOX(${x}/${y}/${z})`;
    }
}

CustomElementRegister(tagName, Boundbox);
