/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-editor-embedded-pbr-item';

/**
 * 内置PBR参数 Item
 */
export default class Item extends Element {
    /**
     * 元素 
     */
    #title;
    #img;

    /**
     * 参数
     */
    #function_attach;

    /**
     * 用户回调函数
     */
    #on_selected;

    /**
     * 
     * 构造函数
     * 
     * @param {*} conf 
     * @param {*} on_selected 
     */
    constructor(conf, on_selected) {
        super(tagName);
        this.createContentFromTpl(tpl);
        this.#title.setData(conf.name || "");
        this.#img  .setSrc(conf.image || "");
        this.#function_attach = conf.attach;
        this.#on_selected = on_selected;
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.onclick = event => this.#onClick(event);
        this.#title  = this.getChild('#name');
        this.#img    = this.getChild('#image');
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClick(event) {
        if (isFunction(this.#on_selected)) {
            this.#on_selected(this.#function_attach);
        }
    }
}

CustomElementRegister(tagName, Item);
