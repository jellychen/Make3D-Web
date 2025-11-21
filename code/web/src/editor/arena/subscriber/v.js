/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import Animation             from '@common/misc/animation';
import ComputePosition       from '@common/misc/compute-position';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-subscriber';

/**
 * 订阅
 */
export default class Subscriber extends Element {
    /**
     * 元素
     */
    #container;
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
        this.#close = this.getChild('#close-btn');
        this.#close.addEventListener('click', () => this.#onClickClose());
    }

    /**
     * 居中显示
     */
    moveToScreenCenter() {
        let document_client_w = document.body.offsetWidth;
        let document_client_h = document.body.offsetHeight;
        this.style.left = (document_client_w - this.offsetWidth ) / 2 + 'px';
        this.style.top  = (document_client_h - this.offsetHeight) / 2 + 'px';
    }

    /**
     * 
     * 移动到指定元素的附近
     * 
     * @param {*} reference_element 
     * @param {*} placement 
     * @param {*} offset 
     */
    moveTo(reference_element, placement, offset = 10) {
        if (isString(placement) && isNumber(offset)) {
            ComputePosition(reference_element, this, placement, offset);
        }
    }

    /**
     * 
     * 显示
     * 
     * @param {*} animation 
     * @param {*} parent_node 
     * @returns 
     */
    show(animation, parent_node = undefined) {
        if (this.parentNode) {
            return;
        }

        parent_node = parent_node || document.body;
        parent_node.appendChild(this);

        // 执行动画
        if (true === animation) {
            Animation.FadeIn(this);
        }
    }

    /**
     * 隐藏元素
     */
    dismiss(animation) {
        if (!this.parentNode) {
            return;
        }
        
        if (true === animation) {
            Animation.Remove(this);
        } else {
            this.remove();
        }
    }

    /**
     * 点击关闭按钮
     */
    #onClickClose() {
        this.dismiss(true);
    }
}

CustomElementRegister(tagName, Subscriber);
