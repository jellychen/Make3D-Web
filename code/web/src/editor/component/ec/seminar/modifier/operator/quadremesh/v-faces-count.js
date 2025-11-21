/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ComputePosition       from '@common/misc/compute-position';
import DropMenu              from '@ux/controller/drop-menu';
import Html                  from './v-faces-count-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-quadremesh-faces-count';

/**
 * 面数的菜单
 */
const menu_item_data = [
    {
        text : "500",
        token: "500",
    },

    {
        text : "1000",
        token: "1000",
    },

    {
        text : "3000",
        token: "3000",
    },

    {
        text : "5000",
        token: "5000",
    },

    {
        text : "8000",
        token: "8000",
    },

    {
        text : "10000",
        token: "10000",
    },
];

/**
 * 面数
 */
export default class FacesCount extends Element {
    /**
     * 元素
     */
    #container;
    #name;
    #number;
    #more;

    /**
     * 标记
     */
    #token = "";

    /**
     * 面数
     */
    #faces_count = 1000;

    /**
     * 获取面熟
     */
    get faces_count() {
        return this.#faces_count;
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
        this.#name      = this.getChild('#name');
        this.#number    = this.getChild('#number');
        this.#more      = this.getChild('#more');
        this.#more.onclick = event => this.#showFacesCountMenu(event);
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name-token",
                "token",
                "default",
            ]);
        }
        return this.attributes;
    }

    /**
     * 
     * 属性适配
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

        if ('name-token' == name) {
            this.setNameToken(_new);
        } else if ('token' == name) {
            this.#token = _new;
        } else if ('default' == name) {
            this.setFacesCount(parseInt(_new));
        }
    }

    /**
     * 
     * 设置令牌
     * 
     * @param {string} token 
     */
    setToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#token = token;
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        if (!isString(token)) {
            return;
        }
        this.#name.setToken(token);
    }

    /**
     * 
     * 获取值
     * 
     * @returns 
     */
    getFacesCount() {
        return this.#faces_count;
    }

    /**
     * 
     * 设置值
     * 
     * @param {*} count 
     */
    setFacesCount(count) {
        this.#faces_count = parseInt(count);
        this.#number.innerText = `${this.#faces_count}`;
    }

    /**
     * 设置
     */
    #showFacesCountMenu() {
        const menu = DropMenu(
            menu_item_data,
            token => {
                this.setFacesCount(parseInt(token));
            },
            () => {},
            false,
            true);
        document.body.appendChild(menu);
        ComputePosition(this.#more, menu, 'auto', 5);
        return menu;
    }
}

CustomElementRegister(tagName, FacesCount);
