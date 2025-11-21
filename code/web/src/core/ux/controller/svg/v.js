/* eslint-disable no-unused-vars */

import isString              from 'lodash/isString';
import AssetsSVG             from '@assets/assets-svg';
import CustomElementRegister from '@ux/base/custom-element-register';
import Element               from '@ux/base/element';
import ElementDomCreator     from '@ux/base/element-dom-creator'
import Html                  from './v-tpl.html';
const tpl = ElementDomCreator.createTpl(Html);
const tagName = 'x-svg';

/**
 * 定义
 */
const childNS = 'http://www.w3.org/1999/xlink';

/**
 * 显示SVG
 */
export default class Svg extends Element {
    /**
     * 元素
     */
    #container;
    #svg;
    #svg_use;

    /**
     * color
     */
    #css_color_0 = '0xFFF';
    #css_color_1 = '0xFFF';
    #css_color_2 = '0xFFF';
    #css_color_3 = '0xFFF';
    #css_color_4 = '0xFFF';
    #css_color_5 = '0xFFF';
    #css_color_6 = '0xFFF';

    /**
     * color set
     */
    #css_color_index = 0;

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
        this.#svg       = this.getChild('#container');
        this.#svg_use   = this.getChild('#use');
    }

    /**
     * 获取属性
     */
    static get observedAttributes() {
        if (!this.attributes) {
            this.attributes = super.observedAttributes.concat([
                "icon", 
                "src", 
                "color", 
                "color-0", 
                "color-1", 
                "color-2", 
                "color-3", 
                "color-4", 
                "color-5", 
                "color-6", 
                "color-index"
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

        if ('icon' == name || 'src' == name) {
            this.setIcon(_new);
        } else if ('color' == name) {
            this.setColor(_new);
        } else if ('color-0' == name) {
            this.setColor_0(_new);
        } else if ('color-1' == name) {
            this.setColor_1(_new);
        } else if ('color-2' == name) {
            this.setColor_2(_new);
        } else if ('color-3' == name) {
            this.setColor_3(_new);
        } else if ('color-4' == name) {
            this.setColor_4(_new);
        } else if ('color-5' == name) {
            this.setColor_5(_new);
        } else if ('color-6' == name) {
            this.setColor_5(_new);
        } else if ('color-index' == name) {
            this.setColorIndex(_new);
        } else if ('enable-pointer-event' == name) {
            this.setEnablePointerEvent(_new);
        }
    }

    /**
     * 
     * 设置图标
     * 
     * @param {string} icon 
     */
    setIcon(icon) {
        if (!isString(icon)) {
            return;
        }

        const content = AssetsSVG(icon);
        if (content) {
            if (content.viewBox) {
                this.#svg.setAttribute('viewBox', content.viewBox);
            } else {
                this.#svg.removeAttribute('viewBox');
            }
            this.#svg_use.setAttributeNS(childNS, 'xlink:href', content.url);
        } else {
            this.#svg_use.setAttributeNS(childNS, 'xlink:href', "");
        }
    }

    /**
     * 
     * 设置图标
     * 
     * @param {string} src 
     */
    setSrc(src) {
        this.setIcon(src);
    }

    /**
     * 
     * CSS Color
     * 
     * @param {string} color 
     */
    setColor(color) {
        this.setColor_0(color);
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_0(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_0 = color;
        if (0 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_1(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_1 = color;
        if (1 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_2(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_2 = color;
        if (2 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_3(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_3 = color;
        if (3 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_4(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_4 = color;
        if (4 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_5(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_5 = color;
        if (5 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置颜色
     * 
     * @param {String} color 
     */
    setColor_6(color) {
        if (!isString(color)) {
            return;
        }

        this.#css_color_6 = color;
        if (6 !== this.#css_color_index) {
            return;
        }
        this.#container.style.color = color;
    }

    /**
     * 
     * 设置显示的颜色
     * 
     * @param {Number} index 
     */
    setColorIndex(index) {
        index = parseInt(index);
        if (index < 0 || index > 6) {
            index = 0;
        }

        if (this.#css_color_index === index) {
            return;
        }
        this.#css_color_index = index;

        // 修改CSS
        switch (this.#css_color_index) {
            case 0:
                this.#container.style.color = this.#css_color_0;
                break;

            case 1:
                this.#container.style.color = this.#css_color_1;
                break;

            case 2:
                this.#container.style.color = this.#css_color_2;
                break;

            case 3:
                this.#container.style.color = this.#css_color_3;
                break;

            case 4:
                this.#container.style.color = this.#css_color_4;
                break;

            case 5:
                this.#container.style.color = this.#css_color_5;
                break;

            case 6:
                this.#container.style.color = this.#css_color_6;
                break;
        }

    }

    /**
     * 
     * 是否响应事件
     * 
     * @param {Boolean} enable 
     */
    setEnablePointerEvent(enable) {
        if (true === enable) {
            this.#container.style.pointerEvents = 'auto';
        } else {
            this.#container.style.pointerEvents = 'none';
        }
    }
}

CustomElementRegister(tagName, Svg);
