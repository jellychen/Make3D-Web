/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import DefaultAvatar         from '@assets/images/misc/default-user-avatar.png';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-avatar';

/**
 * 头像
 */
export default class Avatar extends Element {
    /**
     * 元素
     */
    #container;
    #img;
    #img_anonymous;
    #loading;

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
        this.#container     = this.getChild('#container');
        this.#img           = this.getChild('#image');
        this.#loading       = this.getChild('#loading');
        this.#img_anonymous = this.getChild('#anonymous');
        this.#img.onload = () => {
            this.#img.style.visibility = "visible";
            this.#img_anonymous.style.visibility = "hidden";
        }
    }

    /**
     * 设置显示默认的头像
     */
    setDefault() {
        this.#img.src = DefaultAvatar;
    }

    /**
     * 设置是匿名
     */
    setAnonymous() {
        this.#img_anonymous.style.visibility = "visible";
        this.#img.style.visibility = "hidden";
    }

    /**
     * 
     * 设置头像显示的地址
     * 
     * @param {string} src 
     */
    setSrc(src) {
        if (!isString(src)) {
            return;
        }
        this.#img_anonymous.style.visibility = "hidden";
        this.#img.style.visibility = "hidden";
        this.#img.src = src;
    }

    /**
     * 
     * setSrc
     * 
     * @param {string} value
     */
    set src(value) {
        this.setSrc(value);
    }

    /**
     * 
     * 显示/隐藏
     * 
     * @param {boolean} show 
     */
    showLoading(show) {
        show = true === show;
        if (show) {
            this.#loading.style.display = "block";
        } else {
            this.#loading.style.display = "none";
        }
    }
}

CustomElementRegister(tagName, Avatar);
