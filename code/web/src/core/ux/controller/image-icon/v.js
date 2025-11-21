/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
// import AssetsManager         from '@assets/assets-manager';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-imag-icon';

/**
 * 图片
 */
export default class ImageIcon extends Element {
    /**
     * 内部元素
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
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#img = this.getChild('#image');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "assets"
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('assets' == name) {
            this.setAssets(_new);
        }
    }

    /**
     * 
     * 设置 assets/images 中
     * 
     * @param {string} src 
     */
    setAssets(src) {
        if (isString(src)) {
            // this.#img.src = AssetsManager.getImageIcon(src);
        }
    }
}

CustomElementRegister(tagName, ImageIcon);
