/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import DefaultHeader         from './v-default-header';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-scene-modal';

/**
 * SceneModal
 */
export default class SceneModal extends Element {
    /**
     * 宿主
     */
    #host;

    /**
     * 元素
     */
    #container;
    #container_header;
    #container_content;

    /**
     * 中间的内容
     */
    #header;
    #content;

    /**
     * 默认的header
     */
    #default_header;

    /**
     * 获取
     */
    get container() {
        return this.#container;
    }

    /**
     * 
     * 构造函数
     * 
     * @param {*} host 
     */
    constructor(host) {
        super(tagName);
        this.#host = host;
        this.createContentFromTpl(tpl);
    }

    /**
     * 构建
     */
    onCreate() {
        super.onCreate();
        this.#container         = this.getChild('#container');
        this.#container_header  = this.getChild('#header');
        this.#container_content = this.getChild('#content-container');
    }

    /**
     * 移除头部内容
     */
    clearHeader() {
        if (this.#default_header) {
            this.#default_header.remove();
            this.#default_header = undefined;
        }
        
        if (this.#header && isFunction(this.#header.remove)) {
            this.#header.remove();
            this.#header = undefined;
        }
    }

    /**
     * 移除内容
     */
    clearContent() {
        if (this.#content && isFunction(this.#content.remove)) {
            this.#content.remove();
            this.#content = undefined;
        }
    }

    /**
     * 清理掉当前的内容
     */
    clear() {
        this.clearHeader();
        this.clearContent();
    }

    /**
     * 
     * 设置头部
     * 
     * @param {*} header 
     */
    setHeader(header) {
        this.clearHeader();
        if (header) {
            this.#container_header.appendChild(header);
        }
        this.#header = header;
    }

    /**
     * 
     * @param {*} title 
     */
    setHeaderDefault(title) {
        this.clearHeader();
        this.#default_header = new DefaultHeader();
        this.#container_header.appendChild(this.#default_header);
        this.#default_header.setDataToken(title);
    }

    /**
     * 
     * 设置内容
     * 
     * @param {*} content 
     */
    setContent(content) {
        this.clearContent();
        if (content) {
            this.#container_content.appendChild(content);
        }
        this.#content = content;
    }

    /**
     * 
     * 设置整个覆盖的
     * 
     * @param {*} content 
     */
    appendOverlayContent(content) {
        this.#container.appendChild(content);
    }

    /**
     * 销毁
     */
    dismiss() {
        this.#host.dismissModal();
    }
}

CustomElementRegister(tagName, SceneModal);
