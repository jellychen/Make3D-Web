/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-image';

/**
 * 图片
 */
export default class Image extends Element {
    /**
     * 内部元素
     */
    #img;

    /**
     * 从blob中创建的URL
     */
    #url_from_blob;

    /**
     * 显示配置
     */
    static #object_fit_fill       = 'fill';
    static #object_fit_contain    = 'contain';
    static #object_fit_cover      = 'cover';
    static #object_fit_none       = 'none';
    static #object_fit_scale_down = 'scale-down';

    /**
     * 
     * 设置src
     * 
     * @param {string} value
     */
    set src(value) {
        if (isString(value)) {
            this.setSrc(value);
        }
    }

    /**
     * 获取
     */
    get src() {
        return this.#img.src;
    }

    /**
     * 
     * 设置图片的展示方式
     * 
     * @param {string} value
     */
    set objectFit(value) {
        if (isString(value)) {
            this.#img.style.objectFit = value;
        }
    }

    /**
     * 获取图片的展示方式
     */
    get objectFit() {
        return this.#img.style.objectFit;
    }

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
        this.#img.onload = () => this.#onLoad();
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "src",
                "assets",
                "object-fit",
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

        if ('src' == name) {
            this.setSrc(_new);
        } else if ('assets' == name) {
            this.setAssets(_new);
        } else if ('object-fit' == name) {
            this.setObjectFit(_new);
        }
    }

    /**
     * 
     * 从Blob中加载
     * 
     * @param {*} blob 
     */
    setBlob(blob) {
        if (this.#url_from_blob) {
            URL.revokeObjectURL(this.#url_from_blob);
        }
        this.#url_from_blob = URL.createObjectURL(blob);
        this.#img.src = this.#url_from_blob;
    }

    /**
     * 
     * 设置图片
     * 
     * @param {string} src 
     */
    setSrc(src) {
        if (this.#url_from_blob) {
            URL.revokeObjectURL(this.#url_from_blob);
            this.#url_from_blob = undefined;
        }

        if (isString(src)) {
            if (src && '' != src) {
                this.#img.src = src;
            } else {
                this.#img.style.display = 'none';
                this.#img.src = '';
            }
        }
    }

    /**
     * 
     * 设置图片的展示方式
     * 
     * @param {string} style 
     */
    setObjectFit(style) {
        if (isString(style)) {
            this.#img.style.objectFit = style;
        }
    }

    /**
     * 图片空间加载完成的回调
     */
    #onLoad() {
        this.#img.style.display = 'block';
        if (this.#url_from_blob) {
            URL.revokeObjectURL(this.#url_from_blob);
            this.#url_from_blob = undefined;
        }
    }
}

CustomElementRegister(tagName, Image);
