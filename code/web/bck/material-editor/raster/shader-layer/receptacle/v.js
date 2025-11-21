/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-shader-layer-receptacle';

/**
 * item 容器
 */
export default class Receptacle extends Element {
    /**
     * 点击移除
     */
    onClickDelete;
    onDestroy;

    /**
     * 元素
     */
    #close;

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
        this.#close = this.getChild('#close');
        this.#close.onclick = event => this.#onClickClose(event);
    }

    /**
     * 
     * 点击了删除的按钮
     * 
     * @param {*} event 
     */
    #onClickClose(event) {
        event.stopPropagation();
        if (isFunction(this.onClickDelete)) {
            try {
                this.onClickDelete();
            } catch (e) {
                console.error(e);
            }
        }
    }
}

CustomElementRegister(tagName, Receptacle);
