/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import Animation             from '@common/misc/animation';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-error-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-svg-extrude-editor-error';

/**
 * 错误提示
 */
export default class Error extends Element {
    /**
     * 元素
     */
    #container;
    #close;

    /**
     * 事件回调
     */
    onclose;

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.setEnableCustomizeMenu(false);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#close     = this.getChild('#close');
        this.#close.onclick = event => {
            if (isFunction(this.onclose)) {
                try {
                    this.onclose();
                } catch (e) {
                    console.error(e);
                }
            }
        };
    }

    /**
     * 插入到Dom
     */
    connectedCallback() {
        super.connectedCallback();
    }
}

CustomElementRegister(tagName, Error);
