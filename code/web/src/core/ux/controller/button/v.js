/* eslint-disable no-unused-vars */

import isFunction            from 'lodash/isFunction';
import isString              from 'lodash/isString';
import isNumber              from 'lodash/isNumber';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-button';

/**
 * 带有凸起的按钮
 */
export default class Button extends Element {
    /**
     * 元素
     */
    #icon;
    #btn;
    #btn_click_callback;
    #btn_text;

    /**
     * 设置按钮是否可用
     */
    set enable(value) {
        this.#btn.disabled = !value;
    }

    /**
     * 获取按钮是否可用
     */
    get enable() {
        return !(this.#btn.disabled);
    }

    /**
     * 设置点击的回调函数
     */
    set onclick(callback) {
        this.#btn_click_callback = callback;
    }

    /**
     * 获取点击的回调函数
     */
    get onclick() {
        return this.#btn_click_callback;
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
        this.#icon     = this.getChild('#icon');
        this.#btn      = this.getChild('#btn');
        this.#btn_text = this.getChild('#text');
        this.#btn.onclick = (event) => {
            this.dispatchUserDefineEvent('click', {});
            if (isFunction(this.#btn_click_callback)) {
                this.#btn_click_callback(this);
            }
            event.stopPropagation();
        };
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "text-data", 
                "text-size", 
                "text-color", 
                "text-token-key", 
                "text-token", 
                "enable",
                "enable-icon",
                "icon",
                "btn-style",
                "btn-size",
                "fullwidth",
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
        
        if ('text-data' == name) {
            this.setTextData(_new);
        } else if ('text-size' == name) {
            this.setTextSize(_new);
        } else if ('text-color' == name) {
            this.setTextColor(_new);
        } else if ('text-token-key' == name || 'text-token' == name) {
            this.setTextTokenKey(_new);
        } else if ('enable' == name) {
            this.enable = ('false' != _new);
        } else if ('enable-icon' == name) {
            this.setEnableIcon('true' === _new);
        } else if ('icon' == name) {
            this.setIcon(_new);
        } else if ('btn-style' == name) {
            this.setBtnStyle(_new);
        } else if ('btn-size' == name) {
            this.setBtnSize(_new);
        } else if ('fullwidth' == name) {
            this.setEnableFullWidth(_new == 'true');
        }
    }

    /**
     * 
     * 设置显示的文本
     * 
     * @param {string} data 
     */
    setTextData(data) {
        if (isString(data)) {
            this.#btn_text.setData(data);
        }
    }

    /**
     * 
     * 设置显示文本的尺寸
     * 
     * @param {number} size 
     */
    setTextSize(size) {
        if (isNumber(size)) {
            this.#btn_text.setSize(size);
        }
    }

    /**
     * 
     * 设置文本显示的颜色
     * 
     * @param {string} color 
     */
    setTextColor(color) {
        if (isString(color)) {
            this.#btn_text.setColor(color);
        }
    }

    /**
     * 
     * 设置文本显示的token
     * 
     * @param {string} token 
     */
    setTextTokenKey(token) {
        if (isString(token)) {
            this.#btn_text.setToken(token);
        }
    }

    /**
     * 
     * 是否开启Icon
     * 
     * @param {boolean} enable 
     */
    setEnableIcon(enable) {
        if (true === enable) {
            this.#icon.style.display = 'block';
        } else {
            this.#icon.style.display = 'none';
        }
    }

    /**
     * 
     * 设置Icon
     * 
     * @param {string} icon 
     */
    setIcon(icon) {
        if (isString(icon)) {
            this.#icon.setSrc(icon);
        }
    }

    /**
     * 
     * 设置样式
     * 
     * normal
     * green
     * red
     * blue
     * purple
     * yellow
     * orange
     * 
     * @param {string} style 
     */
    setBtnStyle(style) {
        if (isString(style)) {
            this.#btn.setAttribute('btn-style', style);
        }
    }

    /**
     * 
     * 设置尺寸
     * 
     * normal
     * small
     * 
     * @param {string} size 
     */
    setBtnSize(size) {
        if (isString(size)) {
            this.#btn.setAttribute('size', size);
        }
    }

    /**
     * 
     * 宽度
     * 
     * @param {*} enable 
     */
    setEnableFullWidth(enable) {
        if (enable) {
            this.#btn.setAttribute('fullwidth', 'true');
        } else {
            this.#btn.removeAttribute('fullwidth');
        }
    }
}

CustomElementRegister(tagName, Button);
