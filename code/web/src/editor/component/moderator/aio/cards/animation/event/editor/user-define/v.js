/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-animation-event-editor-user-define';

/**
 * 定时器
 */
export default class EditorUserDefine extends Element {
    /**
     * 元素
     */
    #container;
    #input;

    /**
     * 获取类型
     */
    get type() {
        return 'user-define';
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

CustomElementRegister(tagName, EditorUserDefine);
