/* eslint-disable no-unused-vars */

import Chroma                from "chroma-js";
import isNumber              from 'lodash/isNumber';
import isString              from 'lodash/isString';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-color';

/**
 * 颜色
 */
export default class Color extends Element {
    /**
     * 元素
     */
    #container;

    /**
     * 颜色的值 HEX
     */
    #color = 0;

    /**
     * 
     * 设置
     * 
     * @param {any} data
     */
    set color(data) {
        this.setColor(data);
    }

    /**
     * 获取
     */
    get color() {
        return this.#color;
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
            this.#container.style.backgroundColor = css;
        } else if (isString(color)) {
            let rgb = Chroma(color).rgb();
            let r = rgb[0];
            let g = rgb[1];
            let b = rgb[2];
            this.#color = (r << 16) | (g << 8) | b;
            this.#container.style.backgroundColor = color;
        }
    }
}

CustomElementRegister(tagName, Color);
