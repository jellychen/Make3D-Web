/* eslint-disable no-unused-vars */

import isString              from 'lodash';
import Chroma                from "chroma-js";
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ColorSelectorPanel    from '@ux/controller/color-selector-panel/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-moderator-cards-light-cell-color';

/**
 * 调整颜色
 */
export default class Number extends Element {
    /**
     * 元素
     */
    #container;
    #name;
    #color;

    /**
     * 颜色
     */
    #color_value = 0xFFFFFF;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 构造函数
     */
    constructor() {
        super(tagName);
        this.createContentFromTpl(tpl);
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "name-token",
                "token",
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
            let rgb = Chroma(_new).rgb();
            let r = rgb[0];
            let g = rgb[1];
            let b = rgb[2];
            this.#color = (r << 16) | (g << 8) | b;
            this.#color.style.backgroundColor = _new;
        } 
    }

    /**
     * 构造
     */
    onCreate() {
        super.onCreate();
        this.#container = this.getChild('#container');
        this.#name      = this.getChild('#name');
        this.#color     = this.getChild('#color');
        this.#color.onclick = event => this.#onClickColor(event);
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
     * 设置颜色
     * 
     * @param {*} hex 
     */
    setHexColor(hex) {
        this.#color_value = hex;
        let r = (hex >> 16) & 0xFF;
        let g = (hex >>  8) & 0xFF;
        let b = (hex      ) & 0xFF;
        let css = Chroma(r, g, b).hex();
        this.#color.style.backgroundColor = css;
    }

    /**
     * 
     * 获取颜色
     * 
     * @returns 
     */
    getHexColor() {
        return this.#color_value;
    }

    /**
     * 
     * 点击
     * 
     * @param {*} event 
     */
    #onClickColor(event) {
        this.nextFrameTick(() => {
            let panel = new ColorSelectorPanel();
            panel.setEnableAlpha(false);
            panel.showCloseBtn(false);
            panel.setDimissIfBlur(true);
            panel.place(this.#color, "auto");
            panel.setColor(this.#color_value);
            panel.addEventListener('color-changed', (event) => {
                this.setHexColor(event.hexValue);
                this.bubblesEvent({
                    token: this.#token,
                    value: this.#color_value,
                });
            });
            document.body.appendChild(panel); 
        });
    }
}

CustomElementRegister(tagName, Number);
