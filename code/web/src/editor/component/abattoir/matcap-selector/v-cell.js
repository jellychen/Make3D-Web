/* eslint-disable no-unused-vars */

import isFunction               from 'lodash/isFunction';
import CustomElementRegister    from '@ux/base/custom-element-register';
import Element                  from '@ux/base/element';
import ElementDomCreator        from '@ux/base/element-dom-creator';
import Html                     from './v-cell-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-matcap-selector-cell';

/**
 * Matcap 选择器
 */
export default class MatcapSelectorCell extends Element {
    /**
     * 回调函数
     */
    #on_selected;
    
    /**
     * 元素
     */
    #thumb;
    #thumb_url;

    /**
     * 元素 url
     */
    #url;

    /**
     * 获取
     */
    get url() {
        return this.#thumb_url;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} on_selected 
     */
    constructor(on_selected) {
        super(tagName);
        this.#on_selected = on_selected;
        if (!isFunction(this.#on_selected)) {
            this.#on_selected = () => {};
        }
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#thumb = this.getChild('#thumb');
        this.#thumb.addEventListener('click', () => {
            this.#on_selected(this.#thumb_url, this.#url)
        });
    }

    /**
     * 
     * 设置数据
     * 
     * @param {*} url 
     */
    setUrl(url) {
        this.#url = url;
    }

    /**
     * 
     * 设置微缩图的网址
     * 
     * @param {*} url 
     */
    setThumbUrl(url) {
        this.#thumb.setSrc(url);
        this.#thumb_url = url;
    }
}

CustomElementRegister(tagName, MatcapSelectorCell);