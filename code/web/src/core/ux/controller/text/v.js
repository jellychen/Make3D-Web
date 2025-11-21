/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import I18n                  from '@ux/i18n';
import I18nTextBundle        from '@ux/i18n/bundle-data';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-text';

/**
 * 文本
 */
export default class Text extends Element {
    /**
     * 元素
     */
    #container;
    #span;

    /**
     * 数据
     */
    #text_bundle = new I18nTextBundle();

    /**
     * 事件回调
     */
    #on_lang_changed_callback = () => this.#onI18nLangeChanged();

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#span = this.getChild("#content");
    }

    /**
     * 支持的属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "data", 
                "raw", 
                "size", 
                "color", 
                "token-key", 
                "token", 
                "clickable", 
                "bold",
                "align",
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

        if ('data' == name || 'raw' == name) {
            this.setData(_new);
        } else if ('size' == name) {
            this.setSize(_new);
        } else if ('color' == name) {
            this.setColor(_new);
        } else if ('token-key' == name || 'token' == name) {
            this.setToken(_new);
        } else if ('clickable' == name) {
            this.setClickable('false' != _new);
        } else if ('bold' == name) {
            if ('true' == _new) {
                this.#container.style.fontWeight = "bold";
            } else {
                this.#container.style.fontWeight = "normal";
            }
        } else if ('align' == _new) {
            this.setAlign(_new);
        }
    }

    /**
     * 挂接到DOM上的回调
     */
    connectedCallback() {
        super.connectedCallback();
        I18n.add('i18n-lang-changed', this.#on_lang_changed_callback);
    }

    /**
     * 从DOM上摘除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        I18n.remove('i18n-lang-changed', this.#on_lang_changed_callback)
    }

    /**
     * 当收到语言发生修改的回调函数
     */
    #onI18nLangeChanged() {
        this.#span.textContent = this.#text_bundle.data;
    }

    /**
     * 
     * 设置显示的内容，不会随着语言的更改而修改
     * 
     * @param {*} data 
     */
    setData(data) {
        if (!isString(data)) {
            return;
        }
        this.#text_bundle.setRaw(data);
        this.#span.textContent = this.#text_bundle.data;
    }

    /**
     * 
     * 获取显示的内容
     * 
     * @returns 
     */
    getData() {
        return this.#span.textContent;
    }

    /**
     * 
     * setData的别名函数
     * 
     * @param {*} data 
     */
    setRaw(data) {
        this.setData(data)
    }

    /**
     * getData的别名
     */
    getRaw() {
        this.getData();
    }

    /**
     * 
     * 设置显示文本的Token，会随着语言的修改而修改
     * 
     * @param {*} key 
     */
    setTokenKey(key) {
        if (!isString(key)) {
            return;
        }
        this.#text_bundle.setToken(key);
        this.#span.textContent = this.#text_bundle.data;
    }

    /**
     * 
     * setTokenKey 的别名函数
     * 
     * @param {string} token 
     */
    setToken(token) {
        this.setTokenKey(token);
    }

    /**
     * 
     * 设置字体的尺寸
     * 
     * @param {*} size 
     */
    setSize(size) {
        if (isNumber(size)) {
            this.#container.style.fontSize = size + 'px';
        } else if (isString(size)) {
            this.#container.style.fontSize = size;
        }
    }

    /**
     * 
     * 设置字体的颜色
     * 
     * @param {string} color 
     */
    setColor(color) {
        if (isString(color)) {
            this.#container.style.color = color;
        }
    }

    /**
     * 
     * 设置文本是不是可以点击
     * 
     * @param {*} clickable 
     */
    setClickable(clickable) {
        if (clickable) {
            this.#container.classList.add('clickable');
        } else {
            this.#container.classList.remove('clickable');
        }
    }

    /**
     * 
     * 设置对齐
     * 
     * @param {*} align 
     */
    setAlign(align) {
        this.setAttribute('align', align);
    }

    /**
     * 语言可能发生了变化
     */
    langMaybeChanged() {
        this.#onI18nLangeChanged();
    }
}

CustomElementRegister(tagName, Text);
