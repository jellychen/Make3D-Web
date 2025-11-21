/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation-event-editor-key';

/**
 * 键盘按下按键
 */
export default class EditorKey extends Element {
    /**
     * 元素
     */
    #container;
    #key;

    /**
     * 获取类型
     */
    get type() {
        return 'key';
    }

    /**
     * 获取 key
     */
    get key() {
        return this.#key.key;
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
        this.#container = this.getChild('#container');
        this.#key       = this.getChild('#key');
    }

    /**
     * 
     * 更新数据
     * 
     * @param {*} data 
     */
    updateUserData(data) {

    }
}

CustomElementRegister(tagName, EditorKey);
