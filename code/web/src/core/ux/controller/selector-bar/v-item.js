/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-selector-bar-item';

/**
 * 选择框
 */
export default class SelectorBarItem extends Element {
    /**
     * 元素
     */
    #container;
    #icon;

    /**
     * token
     */
    #token;

    /**
     * 获取
     */
    get token() {
        return this.#token;
    }

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
        this.#icon      = this.getChild('#icon');
        this.onclick    = event => {
            this.bubblesEvent({ item: this });
        };
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                'icon', 
                'token',
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性设置
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

        if ('token' == name) {
            this.setToken(_new);
        } else if ('icon' == name) {
            this.setIcon(_new);
        }
    }

    /**
     * 
     * 设置
     * 
     * @param {*} token 
     */
    setToken(token) {
        this.#token = token;
    }

    /**
     * 
     * 设置
     * 
     * @param {*} icon 
     */
    setIcon(icon) {
        this.#icon.setIcon(icon);
    }

    /**
     * 
     * 设置选择
     * 
     * @param {*} selected 
     */
    setSelected(selected) {
        if (selected) {
            this.#container.setAttribute('selected', 'true');
        } else {
            this.#container.setAttribute('selected', 'false');
        }
    }
}

CustomElementRegister(tagName, SelectorBarItem);
