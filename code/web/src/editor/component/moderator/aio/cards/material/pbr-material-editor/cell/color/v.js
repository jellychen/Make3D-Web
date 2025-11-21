/* eslint-disable no-unused-vars */

import Chroma                from "chroma-js";
import isNumber              from 'lodash/isNumber';
import isString              from 'lodash/isString';
import isArray               from "lodash/isArray";
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator';
import ColorSelectorPanel    from '@ux/controller/color-selector-panel/v';
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-biz-material-editor-color';

/**
 * 调整颜色
 */
export default class MaterialEditorColor extends Element {
    /**
     * 元素
     */
    #name;
    #color_panel;

    /**
     * 标记类型
     */
    #token = "";

    /**
     * 颜色
     */
    #color = 0xFFFFFF;

    /**
     * 事件回调
     */
    #on_click_color = (event) => this.#onClickColorPanel(event);

    /**
     * 获取
     */
    get r() {
        return (this.#color >> 16) & 0xFF;
    }

    /**
     * 获取
     */
    get g() {
        return (this.#color >>  8) & 0xFF;
    }

    /**
     * 获取
     */
    get b() {
        return (this.#color      ) & 0xFF;
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
        this.#name = this.getChild('#name');
        this.#color_panel = this.getChild('#color');
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
            this.setColor(_new);
        }
    }

    /**
     * 插入DOM的回调
     */
    connectedCallback() {
        super.connectedCallback();

        // 事件
        this.#color_panel.addEventListener('pointerdown', this.#on_click_color);
    }

    /**
     * 从DOM中移除的回调
     */
    disconnectedCallback() {
        super.disconnectedCallback();

        // 移除事件
        this.#color_panel.removeEventListener('pointerdown', this.#on_click_color);
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {Number} color 
     */
    setColor(color) {
        if (isNumber(color)) {
            this.#color = color;
            let r = (color >> 16) & 0xFF;
            let g = (color >>  8) & 0xFF;
            let b = (color      ) & 0xFF;
            let css = Chroma(r, g, b).hex();
            this.#color_panel.style.backgroundColor = css;
        } else if (isString(color)) {
            let rgb = Chroma(color).rgb();
            let r = rgb[0];
            let g = rgb[1];
            let b = rgb[2];
            this.#color = (r << 16) | (g << 8) | b;
            this.#color_panel.style.backgroundColor = color;
        }
    }

    /**
     * 
     * 设置 rgb值， 0 - 255
     * 
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     */
    setColor_RGB(r, g, b) {
        if (isArray(r)) {
            g = r[1];
            b = r[2];
            r = r[0];
        }

        const css = Chroma(r, g, b).hex();
        this.#color = (r << 16) | (g << 8) | b;
        this.#color_panel.style.backgroundColor = css;
    }

    /**
     * 
     * 设置 rgb值， 0 - 1
     * 
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     */
    setColor_RGB_normalization(r, g, b) {
        if (isArray(r)) {
            g = r[1];
            b = r[2];
            r = r[0];
        }

        r = r * 255;
        g = g * 255;
        b = b * 255;
        const css = Chroma(r, g, b).hex();
        this.#color = (r << 16) | (g << 8) | b;
        this.#color_panel.style.backgroundColor = css;
    }

    /**
     * 
     * 设置名称
     * 
     * @param {string} token 
     */
    setNameToken(token) {
        this.#name.setToken(token);
    }

    /**
     * 
     * 点击颜色
     * 
     * @param {*} event 
     */
    #onClickColorPanel(event) {
        this.nextFrameTick(() => {
            let panel = new ColorSelectorPanel();
            panel.setEnableAlpha(false);
            panel.showCloseBtn(false);
            panel.setDimissIfBlur(true);
            panel.place(this.#color_panel, "right");
            panel.setColor(this.#color);
            panel.addEventListener('color-changed', (event) => {
                this.#onColorChanged(event.hexValue);
            });
            document.body.appendChild(panel); 
        });  
    }

    /**
     * 
     * 颜色发生变化
     * 
     * @param {Number} color 
     */
    #onColorChanged(color) {
        this.#color = color;
        this.#color_panel.style.backgroundColor = this.getColorHexStr();

        // 发送冒泡事件
        this.bubblesEvent({
            token: this.#token,
            element: this,
        });
    }

    /**
     * 
     * 获取颜色
     * 
     * @returns 
     */
    getColor() {
        return this.#color;
    }

    /**
     * 
     * 获取Hex
     * 
     * @returns 
     */
    getColorHexStr() {
        let r = (this.#color >> 16) & 0xFF;
        let g = (this.#color >>  8) & 0xFF;
        let b = (this.#color      ) & 0xFF;
        return Chroma(r, g, b).hex();
    }
}

CustomElementRegister(tagName, MaterialEditorColor);
