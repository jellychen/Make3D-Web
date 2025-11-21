/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import CountPanel            from './v-count-panel';
import Html                  from './v-voxel-segments-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-ec-modifier-voxelremesh-segments';

/**
 * 面数
 */
export default class SegmentsCount extends Element {
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
    #segments_count = 16;

    /**
     * 获取分段数
     */
    get segments_count() {
        return this.#segments_count;
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
        this.#container    = this.getChild('#container');
        this.#name         = this.getChild('#name');
        this.#number       = this.getChild('#number');
        this.#more         = this.getChild('#more');
        this.#more.onclick = event => this.#showSegmentsCountPanel(event);
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
     * 设置值
     * 
     * @param {*} count 
     */
    setSegmentsCount(count) {
        this.#segments_count = parseInt(count);
        this.#number.innerText = `${this.#segments_count}`;
    }

    /**
     * 设置
     */
    #showSegmentsCountPanel() {
        const panel = new CountPanel();
        panel.on_selected = count => this.setSegmentsCount(count);
        panel.show(this.#more);
        return panel;
    }
}

CustomElementRegister(tagName, SegmentsCount);
