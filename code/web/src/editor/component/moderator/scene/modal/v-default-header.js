/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-default-header-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-scene-modal-default-header';

/**
 * SceneModal 默认的头部
 */
export default class SceneModalDefaultHeader extends Element {
    /**
     * 元素
     */
    #title;

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
        this.#title = this.getChild('#title');
    }

    /**
     * 
     * 设置内容
     * 
     * @param {*} data 
     */
    setData(data) {
        this.#title.setData(data);
    }

    /**
     * 
     * 设置内容
     * 
     * @param {*} token 
     */
    setDataToken(token) {
        this.#title.setToken(token);
    }
}

CustomElementRegister(tagName, SceneModalDefaultHeader);
