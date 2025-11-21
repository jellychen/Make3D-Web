/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-icon-status-switcher';

/**
 * 图标状态选择器
 */
export default class IconStatusSwitcher extends Element {
    /**
     * 内部元素
     */
    #container;
    #svg;
    #sign;

    /**
     * 令牌
     */
    #token;

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
        this.#container = this.getChild('#container');
        this.#svg       = this.getChild('#icon');
        this.#sign      = this.getChild('#sign');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
                "enable", 
                "selected", 
                "token", 
                "sign-location"
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * @param {*} name 
     * @param {*} _old 
     * @param {*} _new 
     */
    attributeChangedCallback(name, _old, _new) {
        if (_old === _new) {
            return;
        }

        super.attributeChangedCallback(name, _old, _new);

        if ('icon' == name) {
            this.setIcon(_new);
        } else if ('enable' == name) {
            this.setEnable('false' != _new);
        } else if ('selected' == name) {
            this.setSelected('false' != _new);
        } else if ('sign-location' == name) {
            this.setSignLocation(_new);
        } else if ('token' == name) {
            this.setToken(_new);
        }
    }

    /**
     * 
     * 设置携带的令牌
     * 
     * @param {any} token
     */
    setToken(token) {
        this.#token = token;
    }

    /**
     * 
     * 设置内置的token
     * 
     * @returns 
     */
    getToken() {
        return this.#token;
    }

    /**
     * 
     * 设置可用性
     * 
     * @param {boolean} enable 
     */
    setEnable(enable = true) {
        if (false === enable) {
            this.setAttribute('enable', 'false');
        } else {
            this.setAttribute('enable', 'true' );
        }
    }

    /**
     * 
     * 设置Icon
     * 
     * @param {string} src 
     */
    setIcon(src) {
        if (isString(src)) {
            this.#svg.setIcon(src);
        }
    }

    /**
     * 
     * 判断是不是被选中
     * 
     * @returns 
     */
    isSelected() {
        return 'true' === this.#container.getAttribute('selected');
    }

    /**
     * 
     * 设置是否被选中
     * 
     * @param {boolean} selected 
     */
    setSelected(selected) {
        if (false === selected) {
            this.#container.setAttribute('selected', 'false');
        } else {
            this.#container.setAttribute('selected', 'true');
        }
    }

    /**
     * 
     * 设置指示的位置
     * 
     * l
     * t
     * r
     * b
     * 
     * @param {string} location 
     */
    setSignLocation(location) {
        if (isString(location)) {
            this.#sign.setAttribute('location', location);
        }
    }
}

CustomElementRegister(tagName, IconStatusSwitcher);
