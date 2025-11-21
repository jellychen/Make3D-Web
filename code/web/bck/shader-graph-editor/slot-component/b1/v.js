/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Base                  from '../base';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = Element.UniqueTag();

/**
 * 组件
 */
export default class Component extends Base {
    /**
     * 元素
     */
    #switcher;

    /**
     * 
     * 构造函数
     * 
     * @param {*} user_data 
     */
    constructor(user_data) {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#switcher = this.getChild('#switcher');
    }
}

CustomElementRegister(tagName, Component);
