/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-key';

/**
 * 用来表示一个系统的按键
 */
export default class Key extends Element {
    /**
     * 元素
     */
    #text;

    /**
     * 获取
     */
    #key;

    /**
     * 事件回调
     */
    on_change;

    /**
     * 获取
     */
    get key() {
        return this.#key;
    }

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造函数
     */
    onCreate() {
        super.onCreate();
        this.#text = this.getChild('#text');
        this.onkeydown = event => this.#onKeyDown(event);
    }

    /**
     * 
     * 设置
     * 
     * @param {*} value 
     */
    setValue(value) {
        this.#key = value;
        this.#text.innerText = value;
    }

    /**
     * 
     * 键盘按下事件
     * 
     * @param {*} event 
     */
    #onKeyDown(event) {
        event.preventDefault();
        const key = event.key;
        if (this.#key == key) {
            return;
        } else {
            this.#key = key;
            this.#text.innerText = key;
            if (isFunction(this.on_change)) {
                try {
                    this.on_change(key);
                } catch(e) {
                    console.error(e);
                }
            }
            this.dispatchUserDefineEvent('changed', {
                key
            });
        }
    }
}

CustomElementRegister(tagName, Key);
