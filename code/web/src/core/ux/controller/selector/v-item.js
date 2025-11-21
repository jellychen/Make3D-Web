/* eslint-disable no-unused-vars */

import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-item-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-selector-item';

/**
 * 下拉列表
 */
export default class Item extends Element {
    /**
     * 元素
     */
    #icon;
    #label;

    /**
     * 值
     */
    #data;

    /**
     * 值
     */
    #value_icon;
    #value_text;

    /**
     * 获取
     */
    get icon() {
        return this.#value_icon;
    }

    /**
     * 获取
     */
    get text() {
        return this.#value_text;
    }

    /**
     * 获取
     */
    get data() {
        return this.#data;
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
        this.#icon   = this.getChild('#icon');
        this.#label  = this.getChild('#label');
        this.onclick = event => {
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
                'data',
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
        } else if ('data' == name) {
            this.setData(_new);
        }
    }

    /**
     * 
     * 设置图标
     * 
     * @param {*} icon 
     */
    setIcon(icon) {
        this.#icon.setIcon(icon);
        this.#value_icon = icon;
    }

    /**
     * 
     * 设置文本
     * 
     * @param {*} token 
     */
    setToken(token) {
        this.#label.setToken(token);
        this.#value_text = token;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} data 
     */
    setData(data) {
        this.#data = data;
    }
}

CustomElementRegister(tagName, Item);